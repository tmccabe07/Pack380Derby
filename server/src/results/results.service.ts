import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RankResultsResponseDto } from './dto/rank-results-response.dto';
import { UnifiedResultsResponseDto } from './dto/unified-results-response.dto';

// Used to calculate weighted score: PLACE_WEIGHT_MULTIPLIER * original lane result
const PLACE_WEIGHT_MULTIPLIER = 100

@Injectable()
export class ResultsService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Get unified results with flexible filtering based on the include parameter
   * Supports filtering by racerType, raceType, rank, or combinations
   * 
   * @param include - Comma-separated filter values (e.g., "cub", "10", "lion,20")
   * @param exclude - Comma-separated raceType values to exclude (e.g., "30")
   * @returns Array of weighted total results
   */
  async getUnifiedResults(include: string, exclude?: string): Promise<UnifiedResultsResponseDto[]> {
    if (!include || include.trim() === '') {
      throw new BadRequestException('include parameter is required');
    }

    const parts = include.split(',').map(p => p.trim());
    
    // Parse the include parameter to determine filter type
    const filters: {
      racerType?: string;
      raceType?: number;
      rank?: string;
    } = {};

    // Valid racerTypes and ranks
    const racerTypes = ['cub', 'sibling', 'adult'];
    const ranks = ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol'];
    
    for (const part of parts) {
      const asNumber = parseInt(part);
      
      // Check if it's a raceType (number: 10, 20, 30, 40, 50)
      if (!isNaN(asNumber) && [10, 20, 30, 40, 50].includes(asNumber)) {
        filters.raceType = asNumber;
      }
      // Check if it's a racerType
      else if (racerTypes.includes(part.toLowerCase())) {
        filters.racerType = part.toLowerCase();
      }
      // Check if it's a rank
      else if (ranks.includes(part.toLowerCase())) {
        filters.rank = part.toLowerCase();
      }
      else {
        throw new BadRequestException(
          `Invalid filter value: "${part}". Must be a racerType (cub/sibling/adult), raceType (10/20/30/40/50), or rank (lion/tiger/wolf/bear/webelos/aol)`
        );
      }
    }

    // Build the where clause based on filters
    const whereClause: any = {
      result: {
        not: 0, // Only include records with actual results
      },
    };

    // Add racerType filter if specified
    if (filters.racerType) {
      whereClause.racerType = filters.racerType;
    }

    // Add raceType filter if specified
    if (filters.raceType) {
      whereClause.raceType = filters.raceType;
    }

    // Handle exclude parameter for raceTypes
    if (exclude && exclude.trim() !== '') {
      const excludeParts = exclude.split(',').map(p => p.trim());
      const excludeRaceTypes: number[] = [];
      
      for (const part of excludeParts) {
        const asNumber = parseInt(part);
        if (!isNaN(asNumber) && [10, 20, 30, 40, 50].includes(asNumber)) {
          excludeRaceTypes.push(asNumber);
        } else {
          throw new BadRequestException(
            `Invalid exclude value: "${part}". Must be a raceType (10/20/30/40/50)`
          );
        }
      }
      
      if (excludeRaceTypes.length > 0) {
        // If a specific raceType is included, we can't also exclude it
        if (filters.raceType && excludeRaceTypes.includes(filters.raceType)) {
          throw new BadRequestException(
            'Cannot include and exclude the same raceType'
          );
        }
        whereClause.raceType = {
          notIn: excludeRaceTypes,
        };
      }
    }

    // Add rank filter if specified (requires joining through car->racer)
    if (filters.rank) {
      whereClause.car = {
        racer: {
          rank: filters.rank,
        },
        name: { not: 'blank' }, // Exclude blank cars
      };
    } else {
      // Always exclude blank cars
      whereClause.car = {
        name: { not: 'blank' },
      };
    }

    // Query heat lanes with the constructed filters
    const heatLanes = await this.prisma.heatLane.findMany({
      select: {
        carId: true,
        result: true,
        racerType: true,
        raceType: true,
        car: {
          select: {
            racer: {
              select: {
                rank: true,
              },
            },
          },
        },
      },
      where: whereClause,
    });

    // Group results by carId and calculate weighted totals
    const carResults = new Map<number, {
      rank?: string | null;
      racerType: string;
      raceType?: number | null;
      weightedTotal: number;
    }>();

    heatLanes.forEach((lane) => {
      if (lane.carId && lane.result !== null) {
        const weightedScore = lane.result * PLACE_WEIGHT_MULTIPLIER;
        const existing = carResults.get(lane.carId);
        
        if (existing) {
          existing.weightedTotal += weightedScore;
          // If we have a raceType filter, keep it in the result
          if (!filters.raceType) {
            existing.raceType = null; // Aggregating across race types
          }
        } else {
          carResults.set(lane.carId, {
            rank: lane.car?.racer?.rank || null,
            racerType: lane.racerType,
            raceType: filters.raceType || null,
            weightedTotal: weightedScore,
          });
        }
      }
    });

    // Convert to response DTOs and sort by weightedTotal (ascending - lower is better)
    return Array.from(carResults.entries())
      .map(([carId, data]) => ({
        carId,
        rank: data.rank,
        racerType: data.racerType,
        raceType: data.raceType,
        weightedTotal: data.weightedTotal,
      }))
      .sort((a, b) => a.weightedTotal - b.weightedTotal);
  }

  

  async getBestOfTheRest(rank: string): Promise<RankResultsResponseDto[]> {
    // Get all car IDs that are in the finals race (raceType 30) for racers with the specified rank
    const finalCarIds = await this.prisma.heatLane.findMany({
      select: {
        carId: true,
      },
      where: {
        raceType: 30, // Finals race type
        car: {
          racer: {
            rank: rank,
          },
        },
      },
      distinct: ['carId'],
    });

    const finalsCarIdSet = new Set(finalCarIds.map(lane => lane.carId).filter(id => id !== null));

    // Get all heat lanes for cars whose racers have the specified rank, excluding finals cars
    const heatLanes = await this.prisma.heatLane.findMany({
      select: {
        carId: true,
        result: true,
        raceType: true,
        car: {
          select: {
            racer: {
              select: {
                rank: true,
              },
            },
          },
        },
      },
      where: {
        result: {
          not: 0,
        },
        carId: {
          notIn: Array.from(finalsCarIdSet),
        },
        car: {
          racer: {
            rank: rank,
          },
        },
      },
    });

    // For each car, determine the highest race type they participated in and their score at that stage
    const carHighestStage = new Map<number, { 
      rank: string; 
      highestRaceType: number; 
      totalPlace: number;
    }>();

    heatLanes.forEach((lane) => {
      if (lane.carId && lane.result !== null && lane.raceType !== null) {
        const weightedScore = lane.result * 100;
        const existing = carHighestStage.get(lane.carId);
        const racerRank = lane.car?.racer?.rank || rank;

        if (existing) {
          // If this is a higher race type, replace with new stage data
          if (lane.raceType > existing.highestRaceType) {
            existing.highestRaceType = lane.raceType;
            existing.totalPlace = weightedScore;
          } else if (lane.raceType === existing.highestRaceType) {
            // Same stage, add to the score
            existing.totalPlace += weightedScore;
          }
          // If lower race type, ignore it
        } else {
          carHighestStage.set(lane.carId, {
            rank: racerRank,
            highestRaceType: lane.raceType,
            totalPlace: weightedScore,
          });
        }
      }
    });

    // Convert to array and sort by highest stage first (descending), then by score within stage (ascending)
    const sortedResults = Array.from(carHighestStage.entries())
      .map(([carId, data]) => ({
        carId,
        rank: data.rank,
        raceType: data.highestRaceType,
        totalPlace: data.totalPlace,
      }))
      .sort((a, b) => {
        // First sort by race type (higher stage is better)
        if (a.raceType !== b.raceType) {
          return b.raceType - a.raceType;
        }
        // Within same stage, sort by score (lower is better)
        return a.totalPlace - b.totalPlace;
      });

    // Return all cars with the best combination (highest stage + best score at that stage)
    if (sortedResults.length === 0) {
      return [];
    }

    const topStage = sortedResults[0].raceType;
    const topScore = sortedResults[0].totalPlace;
    return sortedResults.filter(result => 
      result.raceType === topStage && result.totalPlace === topScore
    );
  }
  
}

import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResultsResponseDto } from './dto/results-response.dto';
import { RankResultsResponseDto } from './dto/rank-results-response.dto';

@Injectable()
export class ResultsService {
  
  constructor(private prisma: PrismaService) {}

  async getRaceResults(createResultDto: CreateResultDto) : Promise<ResultsResponseDto[]> {
    
    const sumBy = createResultDto.sumBy;
    const carId = createResultDto.carId;
    const raceType = createResultDto.raceType;
    const rank = createResultDto.rank;

    let selectHeats;
    
    switch(sumBy){
      case 10: //sum by car id AND race type 
        //find all heats of cars that match the car id and race type to filter on
        selectHeats = await this.prisma.heatLane.findMany({
          select: {
            result: true,
            raceId: true,
            carId: true,
            id: true,
          },
          where: {
            carId: carId,
            raceType: raceType,
          },
          orderBy: {
            raceId: 'asc',
          },
        })
        break;
      case 20: //sum all cars by race type AND rank
        //find all heats of cars that match the race type and rank to filter on
        selectHeats = await this.prisma.heatLane.findMany({
          select: {
            result: true,
            raceId: true,
            carId: true,
            id: true,
          },
          where: {
            raceType: raceType,
            rank: rank,
          },
          orderBy: {
            raceId: 'asc',
          },
        })
        break;
      case 30: //sum all races for a rank
        //find all heats of cars that match the rank to filter on
        selectHeats = await this.prisma.heatLane.findMany({
          select: {
            result: true,
            raceId: true,
            carId: true,
            id: true,
          },
          where: {
            rank: rank,
          },
          orderBy: {
            raceId: 'asc',
          },
        })
        break;
    }

    //initialize total results array
    const totalResults = [
      { 
        carId: carId,
        raceType: raceType,
        rank: rank,
        aggResults: 0, 
      },
    ];

    totalResults.length = 0;


    let totalResultsIndex = 0;

    let cars = [0];

    cars.length = 0;

    let uniqueCars = [0];

    uniqueCars.length = 0;

    if(selectHeats.length > 0){

      for(let i = 0; i < selectHeats.length; i++){   
        cars.push(selectHeats[i].carId);
      }

      //console.log("cars: " + cars);

      //find number of unique cars in select heats
      cars.forEach(item => {
        if (!uniqueCars.includes(item)) {
          uniqueCars.push(item);
        }
      })

      //console.log("unique cars: " + uniqueCars);
      
      for(let i=0; i < uniqueCars.length; i++){

        totalResults.push({
          carId: uniqueCars[i],
          raceType: raceType,
          rank: rank,
          aggResults: 0,
        })

        totalResultsIndex = totalResults.length-1;

        //if unique cars is more than one, need to only sum the select heats for that car
        const specificHeats = selectHeats.filter(element => element.carId === uniqueCars[i]);

        //sum up results for each set of heats for one car at a time 
        for(let j = 0; j < specificHeats.length; j++){
            totalResults[totalResultsIndex].aggResults = totalResults[totalResultsIndex].aggResults + (specificHeats[j].result ?? 0); 
        }

        totalResultsIndex++;
      }
    }

    return totalResults;

  }

  async getResultsByRank(rank: string, raceType: number): Promise<RankResultsResponseDto[]> {
  
    //console.log(`getResultsByRank called with rank=${rank}, raceType=${raceType}`);
    // Get all heat lanes for the specified rank and race type
    const heatLanes = await this.prisma.heatLane.findMany({
      select: {
        carId: true,
        result: true,
        rank: true,
        raceType: true,
      },
      where: {
        rank: rank,
        raceType: raceType,
        result: {
          not: 0, // Only include records with actual results, since 0 would weight as 0 anyway
        }, 
      },
    });

    //console.log("getResultsByRank - heatLanes:", heatLanes);

    // Group results by carId and calculate weighted score (100 * original lane result)
    const carResults = new Map<number, { rank: string; raceType: number; totalPlace: number }>();

    heatLanes.forEach((lane) => {
      if (lane.carId && lane.result !== null) {
        const weightedScore = lane.result * 100; // Calculate weighted score: 100 * original lane result
        const existing = carResults.get(lane.carId);
        if (existing) {
          existing.totalPlace += weightedScore;
        } else {
          carResults.set(lane.carId, {
            rank: lane.rank || rank,
            raceType: lane.raceType || raceType,
            totalPlace: weightedScore,
          });
        }
      }
    });

    // Convert to response DTOs
    return Array.from(carResults.entries()).map(([carId, data]) => ({
      carId,
      rank: data.rank,
      raceType: data.raceType,
      totalPlace: data.totalPlace,
    }));
  }

  async getFinalResultsByRank(rank: string): Promise<RankResultsResponseDto[]> {
    // Get all car IDs that are in the finals race (raceType 30) for racers with the specified rank
    const finalCarIds = await this.prisma.heatLane.findMany({
      select: {
        carId: true,
      },
      where: {
        raceType: 30, // Finals race type
        carId: {
          not: null,
        },
        car: {
          racer: {
            rank: rank,
          },
        },
      },
      distinct: ['carId'],
    });

    const finalsCarIdSet = new Set(finalCarIds.map(lane => lane.carId).filter(id => id !== null));

    // Get all heat lanes for cars whose racers have the specified rank, across ALL race types, excluding finals cars
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

    // Group results by carId and calculate weighted score across all races
    const carResults = new Map<number, { rank: string; totalPlace: number }>();

    heatLanes.forEach((lane) => {
      if (lane.carId && lane.result !== null) {
        const weightedScore = lane.result * 100;
        const existing = carResults.get(lane.carId);
        const racerRank = lane.car?.racer?.rank || rank;
        if (existing) {
          existing.totalPlace += weightedScore;
        } else {
          carResults.set(lane.carId, {
            rank: racerRank,
            totalPlace: weightedScore,
          });
        }
      }
    });

    // Convert to array and sort by totalPlace (ascending - lower is better)
    const sortedResults = Array.from(carResults.entries())
      .map(([carId, data]) => ({
        carId,
        rank: data.rank,
        raceType: undefined, // Not applicable since we're aggregating across all race types
        totalPlace: data.totalPlace,
      }))
      .sort((a, b) => a.totalPlace - b.totalPlace);

    // Return all cars with the best score (handles ties)
    if (sortedResults.length === 0) {
      return [];
    }

    const topScore = sortedResults[0].totalPlace;
    return sortedResults.filter(result => result.totalPlace === topScore);
  }

  async getAllResultsByRank(rank: string): Promise<RankResultsResponseDto[]> {
    // Get all heat lanes for cars whose racers have the specified rank, across ALL race types
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
        car: {
          racer: {
            rank: rank,
          },
        },
      },
    });

    // Group results by carId and calculate weighted score across all races
    const carResults = new Map<number, { rank: string; totalPlace: number }>();

    heatLanes.forEach((lane) => {
      if (lane.carId && lane.result !== null) {
        const weightedScore = lane.result * 100;
        const existing = carResults.get(lane.carId);
        const racerRank = lane.car?.racer?.rank || rank;
        if (existing) {
          existing.totalPlace += weightedScore;
        } else {
          carResults.set(lane.carId, {
            rank: racerRank,
            totalPlace: weightedScore,
          });
        }
      }
    });

    // Convert to array and sort by totalPlace (ascending - lower is better)
    const sortedResults = Array.from(carResults.entries())
      .map(([carId, data]) => ({
        carId,
        rank: data.rank,
        raceType: undefined, // Not applicable since we're aggregating across all race types
        totalPlace: data.totalPlace,
      }))
      .sort((a, b) => a.totalPlace - b.totalPlace);

    // Return all cars with the best score (handles ties)
    if (sortedResults.length === 0) {
      return [];
    }

    const topScore = sortedResults[0].totalPlace;
    return sortedResults.filter(result => result.totalPlace === topScore);
  }
  
}

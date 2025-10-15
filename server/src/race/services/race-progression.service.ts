import { Injectable } from '@nestjs/common';
import { RaceStage, RacerType, RaceResult } from '../../common/types/race.types';
import { RaceConfiguration } from '../types/race-config.types';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CompetitionService } from '../../competition/competition.service';

@Injectable()
export class RaceProgressionService {
  private readonly defaultConfigs: Record<RaceStage, Omit<RaceConfiguration, 'lanesPerHeat'>> = {
    [RaceStage.PRELIMINARY]: {
      heatMultiplier: Infinity, // All cars advance
      stageName: 'preliminary',
      nextStage: RaceStage.QUARTERFINAL,
      deadheatStage: null,
    },
    [RaceStage.QUARTERFINAL]: {
      heatMultiplier: 4, // 4 heats worth of cars advance
      stageName: 'quarterfinal',
      nextStage: RaceStage.SEMIFINAL,
      deadheatStage: RaceStage.QUARTER_DEADHEAT,
    },
    [RaceStage.SEMIFINAL]: {
      heatMultiplier: 2, // Will be overridden by competition service
      stageName: 'semifinal',
      nextStage: RaceStage.FINAL,
      deadheatStage: RaceStage.SEMI_DEADHEAT,
    },
    [RaceStage.FINAL]: {
      heatMultiplier: 1, //Will be overridden by competition service
      stageName: 'final',
      nextStage: null,
      deadheatStage: null,
    },
    [RaceStage.QUARTER_DEADHEAT]: {
      heatMultiplier: 2, //Will be overridden by competition service
      stageName: 'quarter-deadheat',
      nextStage: RaceStage.SEMIFINAL,
      deadheatStage: RaceStage.QUARTER_DEADHEAT,
    },
    [RaceStage.SEMI_DEADHEAT]: {
      heatMultiplier: 1, //Will be overridden by competition service
      stageName: 'semi-deadheat',
      nextStage: RaceStage.FINAL,
      deadheatStage: RaceStage.SEMI_DEADHEAT,
    }
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private competitionService: CompetitionService
  ) {}

  getConfiguration(stage: RaceStage, lanesPerHeat: number): RaceConfiguration {
    const config = this.defaultConfigs[stage];
    if (!config) {
      throw new Error(`Invalid race stage: ${stage}`);
    }

    return {
      ...config,
      lanesPerHeat
    };
  }

  async calculateAdvancingCount(stage: RaceStage, lanesPerHeat: number, racerType: RacerType): Promise<number> {
    const config = this.defaultConfigs[stage];
    if (!config) {
      throw new Error(`Invalid race stage: ${stage}`);
    }

    // For preliminary races, all cars advance
    if (stage === RaceStage.PRELIMINARY) {
      return Infinity;
    }

    const totalCars = await this.prisma.car.count({
        where : {
          racer: {
          rank: racerType === RacerType.CUB 
            ? { notIn: [RacerType.SIBLING, RacerType.ADULT] }
            : { equals: racerType }
        },
          name: { not: 'blank' }
        }
      });

    if (stage === RaceStage.QUARTERFINAL) {
      // Calculate total heats needed (rounded up to next integer)
      const totalHeats = Math.ceil(totalCars / lanesPerHeat);
      
      return totalHeats * lanesPerHeat; 
    }

    // Use competition service multipliers for semifinals, finals, and their deadheats
    let multiplier: number;
    if (stage === RaceStage.SEMIFINAL) {
      multiplier = this.competitionService.getSemifinalMultiplier();
    } else if (stage === RaceStage.FINAL) {
      multiplier = this.competitionService.getFinalMultiplier();
    } else if (stage === RaceStage.QUARTER_DEADHEAT) {
      // Use semifinal multiplier for quarter deadheat
      multiplier = this.competitionService.getSemifinalMultiplier();
    } else if (stage === RaceStage.SEMI_DEADHEAT) {
      // Use final multiplier for semi deadheat
      multiplier = this.competitionService.getFinalMultiplier();
    } else {
      // For other stages, use environment variables if available, otherwise use default multipliers
      multiplier = this.configService.get<number>(
        `RACE_ADVANCE_MULTIPLIER_${stage}`,
        config.heatMultiplier
      );
    }
 
    if (totalCars <= lanesPerHeat * multiplier) {
      return lanesPerHeat; // Only one heat worth can advance
    }

    return lanesPerHeat * multiplier;
  }

  getNextStage(currentStage: RaceStage): RaceStage | null {
    return this.defaultConfigs[currentStage]?.nextStage ?? null;
  }

  getDeadheatStage(currentStage: RaceStage): RaceStage | null {
    return this.defaultConfigs[currentStage]?.deadheatStage ?? null;
  }

  async determineAdvancingResults(
    results: RaceResult[],
    targetCount: number
): Promise<{ advancing: number[]; needsTiebreaker: boolean; tiedCarIds: number[] }> {
    // Handle empty results
    if (!results.length) {
        return { advancing: [], needsTiebreaker: false, tiedCarIds: [] };
    }

    // Sort results by score (lower is better)
    const sortedResults = [...results].sort((a, b) => a.totalScore - b.totalScore);
    
    // If we have fewer results than target or infinite target, everyone advances
    if (sortedResults.length <= targetCount || !Number.isFinite(targetCount)) {
        return {
            advancing: sortedResults.map(r => r.carId),
            needsTiebreaker: false,
            tiedCarIds: []
        };
    }

    // Find cutoff score
    const cutoffScore = sortedResults[targetCount - 1].totalScore;

    // Get cars definitely advancing (below cutoff)
    const definitelyAdvancing = sortedResults
        .filter(r => r.totalScore < cutoffScore)
        .map(r => r.carId);

    // Get cars at the cutoff score
    const carsAtCutoff = sortedResults.filter(r => r.totalScore === cutoffScore);
    
    // Calculate remaining spots
    const spotsLeftAtCutoff = targetCount - definitelyAdvancing.length;

    // If exact number of spots left, everyone at cutoff advances
    if (carsAtCutoff.length === spotsLeftAtCutoff) {
        return {
            advancing: [...definitelyAdvancing, ...carsAtCutoff.map(r => r.carId)],
            needsTiebreaker: false,
            tiedCarIds: []
        };
    }

    // If more cars than spots, need tiebreaker
    if (carsAtCutoff.length > spotsLeftAtCutoff) {
        return {
            advancing: definitelyAdvancing,
            needsTiebreaker: true,
            tiedCarIds: carsAtCutoff.map(r => r.carId)
        };
    }

    // Should never reach here
    throw new Error(
        `Unexpected state in determineAdvancingResults: ` +
        `targetCount=${targetCount}, ` +
        `definitelyAdvancing=${definitelyAdvancing.length}, ` +
        `carsAtCutoff=${carsAtCutoff.length}`
    );
}

}

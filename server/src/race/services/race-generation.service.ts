import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CompetitionService } from '../../competition/competition.service';
import { RaceStage, RacerType } from '../../common/types/race.types';
import { Race, Car, HeatLane } from '@prisma/client';
import { RaceProgressionService } from './race-progression.service';

@Injectable()
export class RaceGenerationService {
  constructor(
    private prisma: PrismaService,
    private progression: RaceProgressionService,
    private competitionService: CompetitionService
  ) {}

  private async shuffleCars(cars: Car[]): Promise<Car[]> {
    const shuffled = [...cars];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private async createBlankCar(): Promise<Car> {
    return this.prisma.car.create({
      data: {
        name: "blank",
        weight: "0",
        racerId: null,
        year: 9999,
        image: "blank",
      }
    });
  }

  private async fillLanes(cars: Car[], lanesPerHeat: number): Promise<Car[]> {
    const filledCars = [...cars];
    const blanksNeeded = lanesPerHeat - (cars.length % lanesPerHeat);
    
    if (blanksNeeded < lanesPerHeat) {
      for (let i = 0; i < blanksNeeded; i++) {
        filledCars.push(await this.createBlankCar());
      }
    }
    
    return filledCars;
  }

  async createQuarterfinalRace(
    racerType: RacerType, 
    groupByRank?: boolean
  ): Promise<Race | Race[]> {
    
    // Get all eligible cars for the given racer type
    const cars = await this.prisma.car.findMany({
      where: {
        racer: {
          rank: racerType === RacerType.CUB 
            ? { notIn: [RacerType.SIBLING, RacerType.ADULT] }
            : { equals: racerType }
        },
        name: { not: 'blank' }
      },
      include: {
        racer: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    // If grouping by rank is not requested, create a single race
    if (!groupByRank) {
      return this.createRace(
        RaceStage.QUARTERFINAL,
        cars,
        racerType
      );
    }

    // Group cars by rank
    const rankGroups = new Map<string, Car[]>();
    cars.forEach(car => {
      const rank = car.racer?.rank || 'unknown';
      if (!rankGroups.has(rank)) {
        rankGroups.set(rank, []);
      }
      rankGroups.get(rank)?.push(car);
    });

    // Create races for each rank group
    const races: Race[] = [];
    for (const [rank, rankCars] of rankGroups) {
      const race = await this.createRace(
        RaceStage.QUARTERFINAL,
        rankCars,
        rank as RacerType
      );
      races.push(race);
    }

    return races;
  }

  async createRace(
    stage: RaceStage,
    cars: Car[],
    racerType: RacerType,
  ): Promise<Race> {
    const usableLanes = this.competitionService.getUsableLanes();
     // Use usable lane count instead of the passed parameter
    const effectiveLanesPerHeat = this.competitionService.getUsableLaneCount();
    
    
    const config = this.progression.getConfiguration(stage, effectiveLanesPerHeat);
    
    // Create the race record
    const race = await this.prisma.race.create({
      data: {
        raceName: config.stageName,
        numLanes: effectiveLanesPerHeat,
        raceType: stage,
        rank: racerType
      }
    });

    // Optionally fill lanes with blank cars if needed
    let processedCars = cars;
    processedCars = await this.fillLanes(cars, effectiveLanesPerHeat);
  
    // Optionally shuffle the cars
    const finalCars = await this.shuffleCars(processedCars);

    // Create heats
    const numHeats = Math.ceil(finalCars.length / effectiveLanesPerHeat);
    const heatLanes: HeatLane[] = [];

    for (let heatIndex = 0; heatIndex < numHeats; heatIndex++) {
      const heatCars = finalCars.slice(
        heatIndex * effectiveLanesPerHeat,
        (heatIndex + 1) * effectiveLanesPerHeat
      );

      for (let laneIndex = 0; laneIndex < heatCars.length; laneIndex++) {
        // Use the actual usable lane number instead of sequential numbering
        const actualLaneNumber = usableLanes[laneIndex] || (laneIndex + 1);
        
        const heatLane = await this.prisma.heatLane.create({
          data: {
            result: 0,
            lane: actualLaneNumber,
            carId: heatCars[laneIndex].id,
            heatId: heatIndex,
            raceId: race.id,
            raceType: stage,
            rank: racerType
          }
        });
        heatLanes.push(heatLane);
      }
    }

    return race;
  }

  async createDeadheatRace(
    tiedCarIds: number[],
    stage: RaceStage,
    racerType: RacerType
  ): Promise<Race> {
    
    const cars = await this.prisma.car.findMany({
      where: {
        id: {
          in: tiedCarIds
        }
      },
      include: {
        racer: true
      }
    });

    // For deadheats, we enforce full lanes but keep groups together
    return this.createRace(
      stage, 
      cars, 
      racerType, 
    );
  }

  async createNextStageRace(
    advancingCarIds: number[],
    stage: RaceStage,
    racerType: RacerType
  ): Promise<Race> {
    
    const cars = await this.prisma.car.findMany({
      where: {
        id: {
          in: advancingCarIds
        }
      }
    });

    return this.createRace(stage, cars, racerType);
  }
}

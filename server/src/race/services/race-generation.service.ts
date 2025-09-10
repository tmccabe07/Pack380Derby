import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RaceStage, RacerType } from '../../common/types/race.types';
import { Race, Car, HeatLane } from '@prisma/client';
import { RaceProgressionService } from './race-progression.service';

@Injectable()
export class RaceGenerationService {
  constructor(
    private prisma: PrismaService,
    private progression: RaceProgressionService
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

  async createQuarterfinalRace(racerType: RacerType, lanesPerHeat: number): Promise<Race> {
    // Get all eligible cars
    const cars = await this.prisma.car.findMany({
      where: {
        racer: {
          rank: racerType === RacerType.CUB 
            ? { notIn: [RacerType.SIBLING, RacerType.ADULT] }
            : { equals: racerType }
        },
        name: { not: 'blank' }
      }
    });

    return this.createRace(RaceStage.QUARTERFINAL, cars, lanesPerHeat, racerType);
  }

  async createRace(
    stage: RaceStage,
    cars: Car[],
    lanesPerHeat: number,
    racerType: RacerType
  ): Promise<Race> {
    const config = this.progression.getConfiguration(stage, lanesPerHeat);
    
    // Create the race record
    const race = await this.prisma.race.create({
      data: {
        raceName: config.stageName,
        numLanes: lanesPerHeat,
        raceType: stage,
        rank: racerType
      }
    });

    // Fill lanes with blank cars if needed and shuffle
    const filledCars = await this.fillLanes(cars, lanesPerHeat);
    const shuffledCars = await this.shuffleCars(filledCars);

    // Create heats
    const numHeats = Math.ceil(shuffledCars.length / lanesPerHeat);
    const heatLanes: HeatLane[] = [];

    for (let heatIndex = 0; heatIndex < numHeats; heatIndex++) {
      const heatCars = shuffledCars.slice(
        heatIndex * lanesPerHeat,
        (heatIndex + 1) * lanesPerHeat
      );

      for (let laneIndex = 0; laneIndex < heatCars.length; laneIndex++) {
        const heatLane = await this.prisma.heatLane.create({
          data: {
            result: 0,
            lane: laneIndex + 1,
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
    lanesPerHeat: number,
    racerType: RacerType
  ): Promise<Race> {
    const cars = await this.prisma.car.findMany({
      where: {
        id: {
          in: tiedCarIds
        }
      }
    });

    return this.createRace(stage, cars, lanesPerHeat, racerType);
  }

  async createNextStageRace(
    advancingCarIds: number[],
    stage: RaceStage,
    lanesPerHeat: number,
    racerType: RacerType
  ): Promise<Race> {
    const cars = await this.prisma.car.findMany({
      where: {
        id: {
          in: advancingCarIds
        }
      }
    });

    return this.createRace(stage, cars, lanesPerHeat, racerType);
  }
}

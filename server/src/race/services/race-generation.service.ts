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

  private async createBlankCar(racerType: string): Promise<Car> {
    // Create a blank racer first since racerId is required
    const blankRacer = await this.prisma.racer.create({
      data: {
        name: "blank",
        den: "N/A",
        rank: "N/A",
        racerType: racerType,
      }
    });

    return this.prisma.car.create({
      data: {
        name: "blank",
        weight: "0",
        racerId: blankRacer.id,
        year: 9999,
        image: "blank",
      }
    });
  }

  private async fillLanes(cars: Car[], lanesPerHeat: number, racerType: string): Promise<Car[]> {
    const filledCars = [...cars];
    const blanksNeeded = lanesPerHeat - (cars.length % lanesPerHeat);
    
    if (blanksNeeded < lanesPerHeat) {
      for (let i = 0; i < blanksNeeded; i++) {
        filledCars.push(await this.createBlankCar(racerType));
      }
    }
    
    return filledCars;
  }

  // Ensure Postgres ID sequences are in sync with table max(id)
  // Prevents "Unique constraint failed on the fields: (id)" when sequences drift
  private async ensureIdSequencesInSync(): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"Racer"', 'id'), COALESCE((SELECT MAX(id) FROM "Racer"), 0))`
      );
      await this.prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"Car"', 'id'), COALESCE((SELECT MAX(id) FROM "Car"), 0))`
      );
    } catch {
      // Best-effort safeguard; ignore errors to avoid blocking race creation
    }
  }

  async createPreliminaryRace(
    racerType: RacerType
  ): Promise<Race> {
    
    // Get all eligible cars for the given racer type
    const cars = await this.prisma.car.findMany({
      where: {
        racer: {
          racerType: racerType === RacerType.CUB 
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

    return this.createRace(
      RaceStage.PRELIMINARY,
      cars,
      racerType
    );
  }

  async createRace(
    stage: RaceStage,
    cars: Car[],
    racerType: RacerType,
  ): Promise<Race> {
    // Repair any sequence drift before we start creating rows
    await this.ensureIdSequencesInSync();

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
        racerType: racerType
      }
    });

    // Optionally fill lanes with blank cars if needed
    let processedCars = cars;
    processedCars = await this.fillLanes(cars, effectiveLanesPerHeat, racerType);
  
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
            racerType: racerType
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

import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, HeatLane, Race } from '@prisma/client';
import { RaceStage, RaceResult, RacerType } from '../common/types/race.types';
import { RaceProgressionService } from './services/race-progression.service';
import { RaceGenerationService } from './services/race-generation.service';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService, 
    private progression: RaceProgressionService,
    private generator: RaceGenerationService) {}


  async createRaceAndHeats(createRaceDto: CreateRaceDto) {
    const { numLanes, raceType, rank } = createRaceDto;
    const currentStage = raceType as RaceStage;
    
    // To start everything, create the quarterfinals
    if (currentStage === RaceStage.PRELIMINARY) {
      return this.generator.createQuarterfinalRace(rank as RacerType, numLanes);
    }

    // Get results from this current stage and its corresponding deadheat stage
    const results = await this.getStageResults(currentStage, rank);

    //console.log("results from current stage: ", results);

    const nextStage = this.progression.getNextStage(currentStage);
      if (!nextStage) {
        throw new Error(`No next stage defined for ${currentStage}`);
      }

    // Calculate who advances for the next stage
    const advancingCount = this.progression.calculateAdvancingCount(nextStage, numLanes);

    //console.log("advancingCount: ", advancingCount);

    const { advancing, needsTiebreaker, tiedCarIds } = 
      await this.progression.determineAdvancingResults(results, advancingCount);

    //console.log("needsTiebreaker: ", needsTiebreaker);
    //console.log("tiedCarIds: ", tiedCarIds);
    //console.log("these cars are advancing: ", advancing);

    // Either handle tie breakers if needed by creating deadheat, or create this stage's race with all the advancers
    if (needsTiebreaker) {
      const deadheatStage = this.progression.getDeadheatStage(currentStage);
      if (!deadheatStage) {
        throw new Error(`No deadheat stage defined for ${currentStage}`);
      }
      return this.generator.createDeadheatRace(
        tiedCarIds,
        deadheatStage,
        numLanes,
        rank as RacerType
      );
    }
    else{

    // Create next stage race
      return this.generator.createNextStageRace(
        advancing,
        nextStage,
        numLanes,
        rank as RacerType
      );

    }

    
  
  }

  async findAll() {
    return this.prisma.race.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async findOne(id: number) : Promise<Race> {
    const oneValue = await this.prisma.race.findUnique({
      where: {
        id: id,
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
  }

  async getStageResults(stage: RaceStage, rank: string): Promise<Array<{ carId: number; totalScore: number }>> {
    // Get all heat results for this stage and its corresponding deadheat stage
    const deadheatStage = this.progression.getDeadheatStage(stage);
    const stages = deadheatStage ? [stage, deadheatStage] : [stage];

    const heatResults = await this.prisma.heatLane.findMany({
      where: {
        raceType: {
          in: stages
        },
        rank: rank,
        car: {
          name: { not: 'blank' } // Exclude blank cars
        }
      },
      select: {
        carId: true,
        result: true,
        raceId: true,
        raceType: true
      },
      orderBy: [
        { raceId: 'asc' },
        { lane: 'asc' }
      ]
    });

    // Group results by car and calculate total score
    const resultMap = new Map<number, number>();
    
    for (const heat of heatResults) {
      if (heat.carId !== null) {  // Ensure carId is not null
        const currentTotal = resultMap.get(heat.carId) ?? 0;
        const resultValue = heat.result ?? 0;
        resultMap.set(heat.carId, currentTotal + resultValue);
      }
    }

    // Convert to array of results
    return Array.from(resultMap.entries()).map(([carId, totalScore]) => ({
      carId,
      totalScore
    }));
  }
  
  async update(id: number, updateRaceDto: UpdateRaceDto): Promise<Race> {
    const checkIndex = await this.prisma.race.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.race.update({
        where: {
          id: id,
        },
        data: updateRaceDto,
    });

  }

  async remove(id: number): Promise<Race> {
    const checkIndex = await this.prisma.race.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.race.delete({
        where: {
          id: id,
        },
    });
  }

  async clearRaceTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."Race"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Race_id_seq" RESTART WITH 1`;
    return "Race table dropped and sequence restarted";
  }

}

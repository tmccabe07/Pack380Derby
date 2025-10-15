import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Race } from '@prisma/client';
import { RaceStage, RacerType } from '../common/types/race.types';
import { RaceProgressionService } from './services/race-progression.service';
import { RaceGenerationService } from './services/race-generation.service';
import { CompetitionService } from '../competition/competition.service';

@Injectable()
export class RaceService {

  constructor(private prisma: PrismaService, 
    private progression: RaceProgressionService,
    private generator: RaceGenerationService,
    private competitionService: CompetitionService) {}

  async createRaceAndHeats(createRaceDto: CreateRaceDto) {
    const { raceType, rank, groupByRank } = createRaceDto;
    const currentStage = raceType as RaceStage;
    const numLanes = this.competitionService.getNumLanes();
    
    // To start everything, create the quarterfinals
    if (currentStage === RaceStage.PRELIMINARY) {
      return this.generator.createQuarterfinalRace(rank as RacerType, groupByRank);
    }

    // Get results from this current stage and its corresponding deadheat stage
    const results = await this.getStageResults(currentStage, rank);

    //console.log("results from current stage: ", results);

    const nextStage = this.progression.getNextStage(currentStage);
      if (!nextStage) {
        throw new Error(`No next stage defined for ${currentStage}`);
      }

    // Calculate who advances for the next stage
    const advancingCount = await this.progression.calculateAdvancingCount(nextStage, numLanes, rank as RacerType);

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
        rank as RacerType
      );
    }
    else{

    // Create next stage race
      return this.generator.createNextStageRace(
        advancing,
        nextStage,
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

  async importRacesFromCSV(fileBuffer: Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    try {
      // Convert buffer to string and normalize line endings
      const content = fileBuffer.toString('utf-8').replace(/\r\n/g, '\n');
      console.log('Raw content:', content);
      
      // Split into lines and remove empty lines
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      console.log('Lines after split:', lines);
      
      if (lines.length === 0) {
        throw new BadRequestException('CSV file is empty');
      }

      // Validate header
      const header = lines[0].toLowerCase().trim();
      console.log('Header:', header);
      if (header !== 'racename,numlanes,racetype,rank') {
        throw new BadRequestException(
          `Invalid CSV header. Expected: 'racename,numlanes,racetype,rank', Got: '${header}'`
        );
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          console.log('Processing line:', line);
          
          const fields = line.split(',').map(field => field.trim());
          console.log('Split fields:', fields);
          
          if (fields.length !== 4) {
            throw new Error(`Expected 4 fields, but got ${fields.length} fields`);
          }

          const [raceName, numLanesStr, raceTypeStr, rank] = fields;

          // Validate required name
          if (!raceName) {
            throw new Error('Race name is required');
          }

          // Convert and validate numeric fields
          const numLanes = parseInt(numLanesStr);
          if (isNaN(numLanes) || numLanes <= 0) {
            throw new Error(`Invalid number of lanes: ${numLanesStr}`);
          }

          const raceType = parseInt(raceTypeStr);
          if (isNaN(raceType)) {
            throw new Error(`Invalid race type: ${raceTypeStr}`);
          }

          // Validate race type is a valid RaceStage
          if (!Object.values(RaceStage).includes(raceType)) {
            throw new Error(`Invalid race type: ${raceType}. Must be a valid RaceStage value`);
          }

          // Validate rank
          const validRanks = ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'cub', 'sibling', 'adult'];
          const normalizedRank = rank.toLowerCase();
          if (!validRanks.includes(normalizedRank)) {
            throw new Error(`Invalid rank: ${rank}. Must be one of: ${validRanks.join(', ')}`);
          }

          // Create race
          await this.prisma.race.create({
            data: {
              raceName,
              numLanes,
              raceType,
              rank: normalizedRank
            }
          });

          console.log('Successfully created race:', raceName);
          results.success++;
        } catch (error) {
          console.error('Error processing line:', line, error);
          results.failed++;
          results.errors.push(`Failed to import race from line: ${line}. Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Fatal error during import:', error);
      throw new BadRequestException(`CSV import failed: ${error.message}`);
    }

    console.log('Import completed:', results);
    return results;
  }

}

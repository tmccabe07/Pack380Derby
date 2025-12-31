import { Injectable, BadRequestException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(RaceService.name);

  constructor(private prisma: PrismaService, 
    private progression: RaceProgressionService,
    private generator: RaceGenerationService,
    private competitionService: CompetitionService) {}

  async createRaceAndHeats(createRaceDto: CreateRaceDto) {
    const { raceType, racerType } = createRaceDto;
    const targetStage = raceType as RaceStage;
    const numLanes = this.competitionService.getNumLanes();

    this.logger.debug(`createRaceAndHeats called with raceType: ${raceType} (target stage to create)`);
    
    // Create the PRELIMINARY race - this is the starting point
    if (targetStage === RaceStage.PRELIMINARY) {
      this.logger.debug('createRaceAndHeats: creating preliminary race');
      return this.generator.createPreliminaryRace(racerType as RacerType);
    }

    // For all other stages, we need to get results from the previous stage
    const previousStage = this.progression.getPreviousStage(targetStage);
    if (!previousStage) {
      throw new Error(`Cannot create ${targetStage}: no previous stage found`);
    }

    // Calculate who advances to the target stage
    const advancingCount = await this.progression.calculateAdvancingCount(targetStage, numLanes, racerType as RacerType);
    this.logger.debug(`advancingCount for ${targetStage}: ${advancingCount}`);

    // Check if deadheat exists and has results
    const deadheatStage = this.progression.getDeadheatStage(previousStage);
    let hasDeadheatResults = false;
    
    if (deadheatStage) {
      const deadheatCheck = await this.prisma.heatLane.findFirst({
        where: {
          raceType: deadheatStage,
          racerType: racerType,
        },
      });
      hasDeadheatResults = deadheatCheck !== null;
    }

    this.logger.debug(`hasDeadheatResults: ${hasDeadheatResults}`);

    if (hasDeadheatResults) {
      // Deadheat exists and has results - use special logic
      if (!deadheatStage) {
        throw new Error(`No deadheat stage defined for previous stage ${previousStage}`);
      }

      // Get preliminary results only (without deadheat)
      const prelimResults = await this.getStageResultsOnly(previousStage, racerType);
      this.logger.debug(`prelim-only results: ${JSON.stringify(prelimResults)}`);

      // Determine who definitely advances and who was tied from prelims
      const { advancing: definitelyAdvancing, needsTiebreaker, tiedCarIds } = 
        await this.progression.determineAdvancingResults(prelimResults, advancingCount);

      this.logger.debug(`definitelyAdvancing from prelims: ${JSON.stringify(definitelyAdvancing)}`);
      this.logger.debug(`tiedCarIds from prelims: ${JSON.stringify(tiedCarIds)}`);

      // Get deadheat results for the tied cars
      const deadheatResults = await this.getStageResultsOnly(deadheatStage, racerType);
      this.logger.debug(`deadheat results: ${JSON.stringify(deadheatResults)}`);

      // Filter to only include cars that were in the tied set
      const tiedCarsDeadheatResults = deadheatResults.filter(r => tiedCarIds.includes(r.carId));
      
      // Calculate how many spots remain for the tied cars
      const spotsRemaining = advancingCount - definitelyAdvancing.length;
      this.logger.debug(`spotsRemaining for deadheat winners: ${spotsRemaining}`);

      // Sort tied cars by their deadheat results and take top N
      const sortedTiedCars = tiedCarsDeadheatResults.sort((a, b) => a.totalScore - b.totalScore);
      const advancingFromDeadheat = sortedTiedCars.slice(0, spotsRemaining).map(r => r.carId);

      this.logger.debug(`advancingFromDeadheat: ${JSON.stringify(advancingFromDeadheat)}`);

      // Combine definitely advancing with deadheat winners
      const allAdvancing = [...definitelyAdvancing, ...advancingFromDeadheat];
      this.logger.debug(`total advancing to ${targetStage}: ${JSON.stringify(allAdvancing)}`);

      // Create target stage race
      return this.generator.createNextStageRace(
        allAdvancing,
        targetStage,
        racerType as RacerType
      );
    } else {
      // No deadheat results yet - use normal logic
      const results = await this.getStageResultsOnly(previousStage, racerType);
      this.logger.debug(`results from previous stage (${previousStage}): ${JSON.stringify(results)}`);

      const { advancing, needsTiebreaker, tiedCarIds } = 
        await this.progression.determineAdvancingResults(results, advancingCount);

      this.logger.debug(`needsTiebreaker: ${needsTiebreaker}`);
      this.logger.debug(`tiedCarIds: ${JSON.stringify(tiedCarIds)}`);
      this.logger.debug(`these cars are advancing: ${JSON.stringify(advancing)}`);

      // Either handle tie breakers if needed by creating deadheat, or create the target stage's race with all the advancers
      if (needsTiebreaker) {
        if (!deadheatStage) {
          throw new Error(`No deadheat stage defined for previous stage ${previousStage}`);
        }
        return this.generator.createDeadheatRace(
          tiedCarIds,
          deadheatStage,
          racerType as RacerType
        );
      } else {
        // Create target stage race
        return this.generator.createNextStageRace(
          advancing,
          targetStage,
          racerType as RacerType
        );
      }
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

  async findHeatsForRace(raceId: number) {
    return await this.prisma.heatLane.findMany({
      where: {
        raceId: raceId
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            racerId: true,
            racer: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { heatId: 'asc' },
        { lane: 'asc' }
      ]
    });
  }

  async findHeatLanesByHeatAndRace(heatId: number, raceId: number) {
    return await this.prisma.heatLane.findMany({
      where: {
        heatId: heatId,
        raceId: raceId
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            racerId: true,
            racer: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { lane: 'asc' }
      ]
    });
  }

async findRoundByRaceType(raceType: number) {
    return await this.prisma.race.findMany({
      where: {
        raceType: raceType
      },
      orderBy: [
        { id: 'asc' }
      ]
    });
  }

  async findRoundByRaceTypeAndRacerType(raceType: number, racerType: string) {
    return await this.prisma.race.findMany({
      where: {
        raceType: raceType,
        racerType: racerType.toLowerCase()
      },
      orderBy: [
        { id: 'asc' }
      ]
    });
  }

  async getStageResults(stage: RaceStage, racerType: string): Promise<Array<{ carId: number; totalScore: number }>> {
    // Get heat results for the main stage
    const mainStageResults = await this.prisma.heatLane.findMany({
      where: {
        raceType: stage,
        racerType: racerType,
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

    // Group main stage results by car and calculate total score
    const mainResultMap = new Map<number, number>();
    
    for (const heat of mainStageResults) {
      if (heat.carId !== null) {
        const currentTotal = mainResultMap.get(heat.carId) ?? 0;
        const resultValue = heat.result ?? 0;
        mainResultMap.set(heat.carId, currentTotal + resultValue);
      }
    }

    // Check if there's a deadheat stage and if it has results
    const deadheatStage = this.progression.getDeadheatStage(stage);
    
    if (deadheatStage) {
      const deadheatResults = await this.prisma.heatLane.findMany({
        where: {
          raceType: deadheatStage,
          racerType: racerType,
          car: {
            name: { not: 'blank' }
          }
        },
        select: {
          carId: true,
          result: true
        }
      });

      // If deadheat results exist, use those scores for cars that participated
      if (deadheatResults.length > 0) {
        const deadheatResultMap = new Map<number, number>();
        
        for (const heat of deadheatResults) {
          if (heat.carId !== null) {
            const currentTotal = deadheatResultMap.get(heat.carId) ?? 0;
            const resultValue = heat.result ?? 0;
            deadheatResultMap.set(heat.carId, currentTotal + resultValue);
          }
        }

        // Replace main stage scores with deadheat scores for cars that participated in deadheat
        for (const [carId, score] of deadheatResultMap.entries()) {
          mainResultMap.set(carId, score);
        }
      }
    }

    // Convert to array of results
    return Array.from(mainResultMap.entries()).map(([carId, totalScore]) => ({
      carId,
      totalScore
    }));
  }

  async getStageResultsOnly(stage: RaceStage, racerType: string): Promise<Array<{ carId: number; totalScore: number }>> {
    // Get heat results for only the specified stage (no deadheat merging)
    const stageResults = await this.prisma.heatLane.findMany({
      where: {
        raceType: stage,
        racerType: racerType,
        car: {
          name: { not: 'blank' } // Exclude blank cars
        }
      },
      select: {
        carId: true,
        result: true,
      },
    });

    // Group results by car and calculate total score
    const resultMap = new Map<number, number>();
    
    for (const heat of stageResults) {
      if (heat.carId !== null) {
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
    
    // Delete associated HeatLane records first due to foreign key constraint
    await this.prisma.heatLane.deleteMany({
      where: {
        raceId: id,
      },
    });
    
    return await this.prisma.race.delete({
        where: {
          id: id,
        },
    });
  }

  async clearRaceTable(): Promise<string> {
    // Delete HeatLane records first due to foreign key constraint
    await this.prisma.$queryRaw`DELETE FROM public."HeatLane" WHERE "raceId" IS NOT NULL`
    await this.prisma.$queryRaw`DELETE FROM public."Race"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Race_id_seq" RESTART WITH 1`;
    await this.prisma.$queryRaw`ALTER SEQUENCE public."HeatLane_id_seq" RESTART WITH 1`;
    return "Race table and related HeatLane records cleared, sequences restarted";
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
      if (header !== 'racename,numlanes,racetype,racertype') {
        throw new BadRequestException(
          `Invalid CSV header. Expected: 'racename,numlanes,racetype,racertype', Got: '${header}'`
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

          const [raceName, numLanesStr, raceTypeStr, racerType] = fields;

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

          // Validate racer type
          const validRacerTypes = ['cub', 'sibling', 'adult'];
          const normalizedRacerType = racerType.toLowerCase();
          if (!validRacerTypes.includes(normalizedRacerType)) {
            throw new Error(`Invalid racerType: ${racerType}. Must be one of: ${validRacerTypes.join(', ')}`);
          }

          // Create race
          await this.prisma.race.create({
            data: {
              raceName,
              numLanes,
              raceType,
              racerType: normalizedRacerType
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

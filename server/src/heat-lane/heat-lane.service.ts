import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateHeatLaneDto } from './dto/create-heat-lane.dto';
import { UpdateHeatLaneDto } from './dto/update-heat-lane.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HeatLane, Prisma } from '@prisma/client';

@Injectable()
export class HeatLaneService {
  constructor(private prisma: PrismaService) {}
  
  async create(data: Prisma.HeatLaneCreateInput) : Promise<HeatLane> {
    return await this.prisma.heatLane.create({
      data,
    });
  }

  async findAll() : Promise<HeatLane[]> {
    return await this.prisma.heatLane.findMany({
      include: {
        car: {
          include: {
            racer : true,
          }
        },
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async findOne(id: number) : Promise<HeatLane> {
    const oneValue = await this.prisma.heatLane.findUnique({
      where: {
        id: id,
      },
      include: {
        car: {
          include: {
            racer : true,
          },
        }
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
  }

  async findRaceType(raceType: number) : Promise<HeatLane[]> {  
    return await this.prisma.heatLane.findMany({
      where:{
        raceType: raceType,
      },
      include: {
        car: {
          include: {
            racer : true,
          }
        },
        race: {
          
        }
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async update(id: number, updateData: Prisma.HeatLaneUpdateInput) : Promise<HeatLane> {
    const checkIndex = await this.prisma.heatLane.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.heatLane.update({
        where: {
          id: id,
        },
        data: updateData,
    });
  }

  async updateResult(id: number, result: number): Promise<HeatLane> {
    const checkIndex = await this.prisma.heatLane.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 

    const data = {
      lane: checkIndex.lane,
      result: result,
      carId: checkIndex.carId,
      heatId: checkIndex.heatId,
      raceId: checkIndex.raceId,
      raceType: checkIndex.raceType,
      rank: checkIndex.rank
    }

    return await this.prisma.heatLane.update({
      where: {
        id: id,
      },
      data: data,
  });

  }

  async remove(id: number) : Promise<HeatLane> {
    const checkIndex = await this.prisma.heatLane.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.heatLane.delete({
        where: {
          id: id,
        },
    });
  }

  async clearHeatLaneTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."HeatLane"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."HeatLane_id_seq" RESTART WITH 1`;
    return "HeatLane table dropped and sequence restarted";
  }

  async importHeatLanesFromCSV(fileBuffer: Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
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
      if (header !== 'lane,result,carid,heatid,raceid,racetype,rank') {
        throw new BadRequestException(
          `Invalid CSV header. Expected: 'lane,result,carid,heatid,raceid,racetype,rank', Got: '${header}'`
        );
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          console.log('Processing line:', line);
          
          const fields = line.split(',').map(field => field.trim());
          console.log('Split fields:', fields);
          
          if (fields.length !== 7) {
            throw new Error(`Expected 7 fields, but got ${fields.length} fields`);
          }

          const [laneStr, resultStr, carIdStr, heatIdStr, raceIdStr, raceTypeStr, rank] = fields;

          // Convert and validate numeric fields
          const lane = parseInt(laneStr);
          if (isNaN(lane)) throw new Error(`Invalid lane number: ${laneStr}`);

          const result = resultStr ? parseFloat(resultStr) : 0;
          if (isNaN(result)) throw new Error(`Invalid result: ${resultStr}`);

          const carId = carIdStr ? parseInt(carIdStr) : null;
          if (carId !== null && isNaN(carId)) throw new Error(`Invalid carId: ${carIdStr}`);

          const heatId = parseInt(heatIdStr);
          if (isNaN(heatId)) throw new Error(`Invalid heatId: ${heatIdStr}`);

          const raceId = parseInt(raceIdStr);
          if (isNaN(raceId)) throw new Error(`Invalid raceId: ${raceIdStr}`);

          const raceType = parseInt(raceTypeStr);
          if (isNaN(raceType)) throw new Error(`Invalid raceType: ${raceTypeStr}`);

          // Validate rank
          const validRanks = ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'cub', 'sibling', 'adult'];
          const normalizedRank = rank.toLowerCase();
          if (!validRanks.includes(normalizedRank)) {
            throw new Error(`Invalid rank: ${rank}. Must be one of: ${validRanks.join(', ')}`);
          }

          // Validate that referenced car exists if carId is provided
          if (carId !== null) {
            const car = await this.prisma.car.findUnique({
              where: { id: carId }
            });
            if (!car) {
              throw new Error(`Car with ID ${carId} not found`);
            }
          }

          // Validate that referenced race exists
          const race = await this.prisma.race.findUnique({
            where: { id: raceId }
          });
          if (!race) {
            throw new Error(`Race with ID ${raceId} not found`);
          }

          // Create heat lane
          await this.create({
            lane,
            result,
            car: carId ? { connect: { id: carId } } : undefined,
            heatId,
            race: { connect: { id: raceId } },
            raceType,
            rank: normalizedRank
          });

          console.log('Successfully created heat lane:', { lane, heatId, raceId });
          results.success++;
        } catch (error) {
          console.error('Error processing line:', line, error);
          results.failed++;
          results.errors.push(`Failed to import heat lane from line: ${line}. Error: ${error.message}`);
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

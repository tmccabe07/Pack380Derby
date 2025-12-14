import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Racer } from '@prisma/client';
import { CreateRacerDto } from './dto/create-racer.dto';
import { UpdateRacerDto } from './dto/update-racer.dto';

@Injectable()
export class RacerService {
  private readonly logger = new Logger(RacerService.name);
  
  constructor(private prisma: PrismaService) {}

  async createRacer(data: CreateRacerDto): Promise<Racer> {
    return await this.prisma.racer.create({
      data,
    });
  }

  async update(id: number, updateData: UpdateRacerDto): Promise<Racer> {
    const checkIndex = await this.prisma.racer.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.racer.update({
        where: {
          id: id,
        },
        data: updateData,
    });

  }

  async searchByName(q: string): Promise<Racer[]> {
    return this.prisma.racer.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
    });
  }
  async findAll() : Promise<Racer[]> {
    return this.prisma.racer.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async findOne(id: number) : Promise<Racer> {
    const oneValue = await this.prisma.racer.findUnique({
      where: {
        id: id,
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
  }

  async remove(id: number) : Promise<Racer> {
    
    const checkIndex = await this.prisma.racer.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.racer.delete({
        where: {
          id: id,
        },
    });

  }

  async clearRacerTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."Racer"`;
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Racer_id_seq" RESTART WITH 1`;
    return "Racer table dropped and sequence restarted";
  }

  async importRacersFromCSV(fileBuffer: Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    try {
      // Convert buffer to string and normalize line endings
      const content = fileBuffer.toString('utf-8').replace(/\r\n/g, '\n');
      this.logger.debug(`Raw content: ${content}`);
      
      // Split into lines and remove empty lines
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      this.logger.debug(`Lines after split: ${JSON.stringify(lines)}`);
      
      if (lines.length === 0) {
        throw new BadRequestException('CSV file is empty');
      }

      // Validate header
      const header = lines[0].toLowerCase().trim();
      this.logger.debug(`Header: ${header}`);
      if (header !== 'name,den,rank') {
        throw new BadRequestException(`Invalid CSV header. Expected: 'name,den,rank', Got: '${header}'`);
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          this.logger.debug(`Processing line: ${line}`);
          
          const fields = line.split(',').map(field => field.trim());
          this.logger.debug(`Split fields: ${JSON.stringify(fields)}`);
          
          if (fields.length !== 3) {
            throw new Error(`Expected 3 fields (name,den,rank), but got ${fields.length} fields`);
          }

          const [name, den, rank] = fields;

          if (!name) {
            throw new Error('Name is required');
          }

          // Validate rank
          const validRanks = ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'sibling', 'adult'];
          const normalizedRank = rank.toLowerCase();
          if (!validRanks.includes(normalizedRank)) {
            throw new Error(`Invalid rank: ${rank}. Must be one of: ${validRanks.join(', ')}`);
          }

          // Create racer
          await this.createRacer({
            name,
            den: den, 
            rank: normalizedRank,
          });

          this.logger.log(`Successfully created racer: ${name}`);
          results.success++;
        } catch (error) {
          this.logger.error(`Error processing line: ${line}`, error.stack);
          results.failed++;
          results.errors.push(`Failed to import racer from line: ${line}. Error: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error('Fatal error during import:', error.stack);
      throw new BadRequestException(`CSV import failed: ${error.message}`);
    }

    this.logger.log(`Import completed: ${JSON.stringify(results)}`);
    return results;
  }
}

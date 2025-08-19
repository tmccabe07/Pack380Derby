import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Racer, Prisma } from '@prisma/client';

@Injectable()
export class RacerService {
  constructor(private prisma: PrismaService) {}

  async createRacer(data: Prisma.RacerCreateInput): Promise<Racer> {
    return await this.prisma.racer.create({
      data,
    });
  }

  async update(id: number, updateData: Prisma.RacerUpdateInput): Promise<Racer> {
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
      if (header !== 'name,den,rank') {
        throw new BadRequestException(`Invalid CSV header. Expected: 'name,den,rank', Got: '${header}'`);
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          console.log('Processing line:', line);
          
          const fields = line.split(',').map(field => field.trim());
          console.log('Split fields:', fields);
          
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
            den: den || undefined, // Handle empty den values
            rank: normalizedRank,
          });

          console.log('Successfully created racer:', name);
          results.success++;
        } catch (error) {
          console.error('Error processing line:', line, error);
          results.failed++;
          results.errors.push(`Failed to import racer from line: ${line}. Error: ${error.message}`);
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

import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, Prisma } from '@prisma/client';


@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CarCreateInput) : Promise<Car> {
    return await this.prisma.car.create({
      data,
    });
 }

  async findAll() : Promise<Car[]> {
    return await this.prisma.car.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  }

  async findAllByRank(inputRank: string) : Promise<Car[]> {
    return await this.prisma.car.findMany({
      where: {
        racer: {
          rank: inputRank,
        }
      },
      include: {
         racer: true,
      },
      orderBy: [
        {
          id: 'asc',
        }
      ]
    })
  }

  async findOne(id: number) : Promise<Car> {
    const oneValue = await this.prisma.car.findUnique({
      where: {
        id: id,
      },
      include: {
        racer: true,
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
 }

  async update(id: number, updateData: Prisma.CarUpdateInput) : Promise<Car> {
    const checkIndex = await this.prisma.car.findUnique({
      where: {
        id: id, 
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.car.update({
        where: {
          id: id,
        },
        data: updateData,
    });
  }

  async remove(id: number) : Promise<Car> {
    const checkIndex = await this.prisma.car.findUnique({
      where: {
        id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.car.delete({
        where: {
          id: id,
        },
    });
  }

  async clearCarTable(): Promise<string> {
    await this.prisma.$queryRaw`DELETE FROM public."Car"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Car_id_seq" RESTART WITH 1`;
    return "Car table dropped and sequence restarted";
  }

  async importCarsFromCSV(fileBuffer: Buffer): Promise<{ success: number; failed: number; errors: string[] }> {
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
      if (header !== 'name,weight,racerid,year,image') {
        throw new BadRequestException(
          `Invalid CSV header. Expected: 'name,weight,racerid,year,image', Got: '${header}'`
        );
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          console.log('Processing line:', line);
          
          const fields = line.split(',').map(field => field.trim());
          console.log('Split fields:', fields);
          
          if (fields.length !== 5) {
            throw new Error(`Expected 5 fields, but got ${fields.length} fields`);
          }

          const [name, weight, racerIdStr, yearStr, image] = fields;

          // Validate required name
          if (!name) {
            throw new Error('Name is required');
          }

          // Convert and validate numeric fields
          const racerId = racerIdStr ? parseInt(racerIdStr) : null;
          if (racerId !== null && isNaN(racerId)) {
            throw new Error(`Invalid racerId: ${racerIdStr}`);
          }

          const year = yearStr ? parseInt(yearStr) : null;
          if (year !== null && isNaN(year)) {
            throw new Error(`Invalid year: ${yearStr}`);
          }

          // Validate that referenced racer exists if racerId is provided
          if (racerId !== null) {
            const racer = await this.prisma.racer.findUnique({
              where: { id: racerId }
            });
            if (!racer) {
              throw new Error(`Racer with ID ${racerId} not found`);
            }
          }

          // Create car
          await this.create({
            name,
            weight: weight || null,
            racer: racerId ? { connect: { id: racerId } } : undefined,
            year: year || null,
            image: image || null
          });

          console.log('Successfully created car:', name);
          results.success++;
        } catch (error) {
          console.error('Error processing line:', line, error);
          results.failed++;
          results.errors.push(`Failed to import car from line: ${line}. Error: ${error.message}`);
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

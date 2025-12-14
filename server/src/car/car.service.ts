import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car } from '@prisma/client';


@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);
  
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCarDto) : Promise<Car> {
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

  async update(id: number, updateCarDto: UpdateCarDto) : Promise<Car> {
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
        data: updateCarDto,
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
      if (header !== 'name,weight,racerid,year,image') {
        throw new BadRequestException(
          `Invalid CSV header. Expected: 'name,weight,racerid,year,image', Got: '${header}'`
        );
      }

      // Process each line
      for (const line of lines.slice(1)) {
        try {
          this.logger.debug(`Processing line: ${line}`);
          const fields = line.split(',').map((field) => field.trim());
          this.logger.debug(`Split fields: ${JSON.stringify(fields)}`);
          if (fields.length !== 5) {
            throw new Error(
              `Expected 5 fields, but got ${fields.length} fields`,
            );
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
          const carDto: CreateCarDto = {
            name,
            weight,
            racerId: racerId || undefined,
            year: year || undefined,
            image,
          };
          await this.create(carDto);

          this.logger.log(`Successfully created car: ${name}`);
          results.success++;
        } catch (error) {
          this.logger.error(`Error processing line: ${line}`, error.stack);
          results.failed++;
          results.errors.push(
            `Failed to import car from line: ${line}. Error: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Fatal error during import:', error.stack);
      throw new BadRequestException(`CSV import failed: ${error.message}`);
    }

    this.logger.log(`Import completed: ${JSON.stringify(results)}`);
    return results;
  }

  async findAllByRacerId(racerId: string): Promise<Car[]> {
    return await this.prisma.car.findMany({
      where: {
        racerId: Number(racerId),
      },
      orderBy: [{ id: 'asc' }],
    });
  }

  async findRacesByCarId(carId: number) {
    return await this.prisma.heatLane.findMany({
      where: {
        carId: carId
      },
      select: {
        raceId: true,
        heatId: true,
        lane: true,
        result: true,
        race: {
          select: {
            raceName: true
          }
        }
      },
      orderBy: [
        { raceId: 'asc' },
        { heatId: 'asc' },
        { lane: 'asc' }
      ]
    });
  }
}

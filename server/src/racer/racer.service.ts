import { Injectable } from '@nestjs/common';
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
    await this.prisma.$queryRaw`DELETE FROM public."Racer"`
    await this.prisma.$queryRaw`ALTER SEQUENCE public."Racer_id_seq" RESTART WITH 1`;
    return "Racer table dropped and sequence restarted";
  }
}

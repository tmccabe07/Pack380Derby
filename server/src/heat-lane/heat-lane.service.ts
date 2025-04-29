import { Injectable } from '@nestjs/common';
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
            person : true,
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
            person : true,
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
            person : true,
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
      role: checkIndex.role
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
}

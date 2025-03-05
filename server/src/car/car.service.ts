import { Injectable } from '@nestjs/common';
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
}

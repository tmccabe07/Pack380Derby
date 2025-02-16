import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Person, Prisma } from '@prisma/client';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    return await this.prisma.person.create({
      data,
    });
  }

  async update(id: number, updateData: Prisma.PersonUpdateInput): Promise<Person> {
    const checkIndex = await this.prisma.person.findUnique({
      where: {
        person_id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.person.update({
        where: {
          person_id: id,
        },
        data: updateData,
    });

  }

  async findAll() : Promise<Person[]> {
    return this.prisma.person.findMany({
      orderBy: [
        {
          person_id: 'asc',
        },
      ],
    })
  }

  async findOne(id: number) : Promise<Person> {
    const oneValue = await this.prisma.person.findUnique({
      where: {
        person_id: id,
      }
    });

    if (oneValue === null) {
      return null as any;
    } 
    
    return oneValue;
  }

  async remove(id: number) : Promise<Person> {
    
    const checkIndex = await this.prisma.person.findUnique({
      where: {
        person_id: id,
      },
    })

    if (checkIndex === null) {
      return null as any;
    } 
    
    return await this.prisma.person.delete({
        where: {
          person_id: id,
        },
    });

  }
}

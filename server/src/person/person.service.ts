import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Person, Prisma } from '@prisma/client';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async person(
    personWhereUniqueInput: Prisma.PersonWhereUniqueInput,
  ): Promise<Person | null> {
    return this.prisma.person.findUnique({
      where: personWhereUniqueInput,
    });
  }

  async persons(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PersonWhereUniqueInput;
    where?: Prisma.PersonWhereInput;
    orderBy?: Prisma.PersonOrderByWithRelationInput;
  }): Promise<Person[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.person.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    return await this.prisma.person.create({
      data,
    });
  }

  async update(id: number, updateData: Prisma.PersonUpdateInput): Promise<Person> {
    return await this.prisma.person.update({
      where: {
        person_id: id,
      },
      data : {
        name: updateData.name,
        rank: updateData.rank,
        den: updateData.den,
        role: updateData.role,  
      },
    });
  }

  async findAll() : Promise<Person[]> {
    return this.prisma.person.findMany()
  }

  async findOne(id: number) : Promise<Person> {
    
    const oneValue = await this.prisma.person.findUnique({
      where: {
        person_id: id,
      }
    });

    if (oneValue === null) {
      return null as any;
    } else {
      return oneValue;
    }
  }

  async remove(id: number) : Promise<Person> {
    const deletePerson = await this.prisma.person.findFirst({
      where: { person_id: id, },
    });

    if (!deletePerson) {
      throw new Error('No person found with that ID');
    }
  
    return this.prisma.person.delete({
      where: { person_id: deletePerson.person_id },
    });
  }
}

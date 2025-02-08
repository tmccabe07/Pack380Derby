import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './interfaces/person.interface';

@Injectable()
export class PersonService {
  private readonly persons: Person[] = [];

  create(createPersonDto: CreatePersonDto) : Person {
    const newPerson: Person = {
      person_id: this.persons.length + 1,
      ...createPersonDto,
    };
    this.persons.push(newPerson);
    return newPerson;
  }

  findAll() : Person[] {
    return this.persons;
  }

  async findOne(id: number) {
    return await this.persons.find(person => person.person_id == id);
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}

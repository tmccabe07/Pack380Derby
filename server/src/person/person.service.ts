import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './interfaces/person.interface';

@Injectable()
export class PersonService {
  private readonly persons: Person[] = [];

  create(createPersonDto: CreatePersonDto) : Person {
    const newPerson: Person = {
      id: this.persons.length + 1,
      ...createPersonDto,
    };
    this.persons.push(newPerson);
    return newPerson;
    //return 'This action adds a new person';
  }

  findAll() : Person[] {
    return this.persons;
    //return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}

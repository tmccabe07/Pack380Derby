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

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    
    //Find index of specific object using findIndex method.    
    const objIndex = await this.persons.findIndex(obj => obj.person_id == id);

    //update the specific object that was found with the update info
    this.persons[objIndex].den = updatePersonDto.den;
    this.persons[objIndex].name = updatePersonDto.name;
    this.persons[objIndex].rank = updatePersonDto.rank;

    return `This action updates a #${id} person`;
  }

  async remove(id: number) {

    //Find index of specific object using findIndex method.    
    const objIndex = await this.persons.findIndex(obj => obj.person_id == id);

    this.persons.splice(objIndex,1);

    return `This action removes a #${id} person`;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person as PersonEntity } from './entities/person.entity';
import { Person as PersonModel} from '@prisma/client';
import { PersonService } from './person.service';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Post()
  @ApiOperation({ summary: 'Create person' })
  @ApiParam( {
    name: "name",
    type: "String",
    description: "Full Name of the user",
    example: "Jane Doe",
    required: true })
  @ApiParam( {
      name: "den",
      type: "String",
      description: "Full den of the user",
      example: "Den 8, Sibling, Adult",
      required: true }) 
  @ApiParam( {
      name: "rank",
      type: "String",
      description: "Rank of the person",
      example: "Lion, Tiger, Wolf, Bear, Webelos, AoL, Sibling, Adult",
      required: true })  
  @ApiParam( {
      name: "role",
      type: "String",
      description: "Role of the person",
      example: "Cub, Sibling, Adult",
      required: true }) 
  @ApiCreatedResponse({ description: 'Person created successfully', type: PersonEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonModel> {
    return this.personService.createPerson(createPersonDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All records',
    type: PersonEntity,
  })
  async findAll(): Promise<PersonModel[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PersonEntity,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PersonModel> {
    const onePerson = await this.personService.findOne(+id);
    if (!onePerson) {
      throw new NotFoundException(`Person with ${id} does not exist.`);
    }
    return onePerson;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove person' })
  @ApiResponse({
    status: 200,
    description: 'The found record was deleted',
    type: PersonEntity,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletePerson = await this.personService.remove(+id);
    if (!deletePerson) {
      throw new NotFoundException(`Person with ${id} does not exist.`);
    }
    return deletePerson;

  }

  
  @Patch(':id')
  @ApiOperation({ summary: 'Update person' })
  @ApiParam( {
    name: "name",
    type: "String",
    description: "Full Name of the user",
    example: "Jane Doe",
    required: true })
  @ApiParam( {
      name: "den",
      type: "String",
      description: "Full den of the user",
      example: "Den 8, Sibling, Adult",
      required: true }) 
  @ApiParam( {
      name: "rank",
      type: "String",
      description: "Rank of the person",
      example: "Lion, Tiger, Wolf, Bear, Webelos, AoL, Sibling, Adult",
      required: true })   
  @ApiCreatedResponse({ description: 'Person updated successfully', type: PersonEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePersonDto: UpdatePersonDto): Promise<PersonModel> {
    
    const updatePerson = await this.personService.update(+id, updatePersonDto);
    if (!updatePerson) {
      throw new NotFoundException(`Person with ${id} does not exist.`);
    }
    return updatePerson;
  }

  
  
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './interfaces/person.interface';
import { Person as PersonEntity } from './entities/person.entity';

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
      example: "Lion, Sibling, Adult",
      required: true })   
  @ApiCreatedResponse({ description: 'Person created successfully', type: PersonEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All records',
    type: PersonEntity,
  })
  async findAll(): Promise<Person[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PersonEntity,
  })
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
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
      example: "Lion, Sibling, Adult",
      required: true })   
  @ApiCreatedResponse({ description: 'Person updated successfully', type: PersonEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove person' })
  @ApiResponse({
    status: 200,
    description: 'The found record was deleted',
    type: PersonEntity,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}

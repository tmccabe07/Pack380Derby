import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car as CarModel } from '@prisma/client';
import { Car as CarEntity } from './entities/car.entity';


@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create car' })
  @ApiParam( {
      name: "name",
      type: "String",
      description: "Full Name of the car",
      example: "Fast Car",
      required: true })
  @ApiParam( {
      name: "weight",
      type: "String",
      description: "Weight of the car",
      example: "5.0",
      required: true }) 
  @ApiParam( {
      name: "racerId",
      type: "Integer",
      description: "Unique ID of racer that owns this car",
      example: "1",
      required: false })  
  @ApiParam( {
      name: "year",
      type: "Integer",
      description: "Year Car Raced",
      example: "2024",
      required: false }) 
  @ApiParam({
      name: "image",
      type: "string",
      description: "filepath to associated image",
      example: "tbd",
      required: false })    
  @ApiCreatedResponse({ description: 'Car created successfully', type: CarEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createCarDto: CreateCarDto) : Promise<CarModel> {    
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiResponse({
      status: 200,
      description: 'All records',
      type: CarEntity,
    })
  async findAll() : Promise<CarModel[]> {
    return this.carService.findAll();
  }

  @Get('byRole/:inputRole')
  @ApiResponse({
      status: 200,
      description: 'All records by role',
      type: CarEntity,
    })
  async findAllByRole(@Param('inputRole') inputRole: string) : Promise<CarModel[]> {
    return this.carService.findAllByRole(inputRole);
  }

  @Get(':id')
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: CarEntity,
    })
  async findOne(@Param('id', ParseIntPipe) id: number) : Promise<CarModel> { 
    const oneCar = await this.carService.findOne(+id);
    if (!oneCar) {
      throw new NotFoundException(`Car with ${id} does not exist.`);
    }
    return oneCar;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update car' })
  @ApiParam( {
    name: "name",
    type: "String",
    description: "Full Name of the car",
    example: "Fast Car",
    required: true })
  @ApiParam( {
    name: "weight",
    type: "String",
    description: "Weight of the car",
    example: "5.0",
    required: true }) 
  @ApiParam( {
    name: "racerId",
    type: "Integer",
    description: "Unique ID of racer that owns this car",
    example: "1",
    required: false })  
  @ApiParam( {
    name: "year",
    type: "Integer",
    description: "Year Car Raced",
    example: "2024",
    required: false }) 
  @ApiParam({
    name: "image",
    type: "string",
    description: "filepath to associated image",
    example: "tbd",
    required: false })  
  @ApiCreatedResponse({ description: 'Car updated successfully', type: CarEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' })     
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCarDto: UpdateCarDto) : Promise<CarModel> {
    const updateCar = await this.carService.update(+id, updateCarDto);
    if (!updateCar) {
      throw new NotFoundException(`Car with ${id} does not exist.`);
    }
    return updateCar;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove car' })
  @ApiResponse({
      status: 200,
      description: 'The found record was deleted',
      type: CarEntity,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id', ParseIntPipe) id: number) : Promise<CarModel> {
    const deleteCar = await this.carService.remove(+id);
    if (!deleteCar) {
      throw new NotFoundException(`Car with ${id} does not exist.`);
    }
    return deleteCar;    
 }

 @Delete('deleteall/clear')
  @ApiOperation({ summary: 'Clear car table and restart id sequence'})
  async clearCarTable(): Promise<string> {
    return await this.carService.clearCarTable();
  }
}

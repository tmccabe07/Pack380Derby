import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  NotFoundException, 
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Get('byRank/:inputRank')
  @ApiResponse({
      status: 200,
      description: 'All records by rank',
      type: CarEntity,
    })
  async findAllByRank(@Param('inputRank') inputRank: string) : Promise<CarModel[]> {
    return this.carService.findAllByRank(inputRank);
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

  @Post('import')
    @ApiOperation({ summary: 'Import cars from CSV file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'CSV file containing car data'
          },
        },
      },
    })
    @UseInterceptors(FileInterceptor('file'))
    async importRacers(
      @UploadedFile() file: Express.Multer.File
    ): Promise<{ success: number; failed: number; errors: string[] }> {
    
    if (!file) {
        throw new BadRequestException('No file uploaded');
      }
  
      if (file.mimetype !== 'text/csv') {
        throw new BadRequestException('File must be a CSV');
      }
      
      return this.carService.importCarsFromCSV(file.buffer);
    }
}

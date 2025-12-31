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
  BadRequestException,
  Query
} from '@nestjs/common';
import { CarResponseDto } from './dto/car-response.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car as CarModel } from '@prisma/client';

@ApiTags('car')
@ApiBearerAuth('bearer')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create car' })
  @ApiCreatedResponse({ description: 'Car created successfully', type: CarResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createCarDto: CreateCarDto) : Promise<CarModel> {    
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars (optionally filter by racerId or include racer)' })
  @ApiResponse({
    status: 200,
    description: 'All records',
    type: CarResponseDto,
    isArray: true,
  })
  async findAll(
    @Query('racerId') racerId?: string,
    @Query('include') include?: string
  ): Promise<CarModel[]> {
    if (racerId) {
      return this.carService.findAllByRacerId(racerId);
    }
    const includeRacer = include === 'racer';
    return this.carService.findAll(includeRacer);
  }

  @Get('byRank/:inputRank')
  @ApiOperation({ summary: 'Get all cars that match the entered rank' })
  @ApiResponse({
      status: 200,
      description: 'All records by rank',
      type: CarResponseDto,
      isArray: true
  })
  async findAllByRank(@Param('inputRank') inputRank: string) : Promise<CarModel[]> {
    return this.carService.findAllByRank(inputRank);
  }

  @Get('byRacerType/:racerType')
  @ApiOperation({ summary: 'Get all cars that match the entered racer type' })
  @ApiResponse({
      status: 200,
      description: 'All records by racer type',
      type: CarResponseDto,
      isArray: true
  })
  async findAllByRacerType(@Param('racerType') racerType: string) : Promise<CarModel[]> {
    return this.carService.findAllByRacerType(racerType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the car that matches the entered id' })
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: CarResponseDto,
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
  @ApiCreatedResponse({ description: 'Car updated successfully', type: CarResponseDto })
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
      type: CarResponseDto,
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

  @Get(':id/races')
  @ApiOperation({ summary: 'Get races for a specific car (race id, heat id, lane, result)' })
  @ApiResponse({
    status: 200,
    description: 'Races for the specified car',
    isArray: true
  })
  async findRacesByCarId(@Param('id', ParseIntPipe) id: number) {
    // First verify the car exists
    const car = await this.carService.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} does not exist.`);
    }

    const races = await this.carService.findRacesByCarId(id);
    return races;
  }
}

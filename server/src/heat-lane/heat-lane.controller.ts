import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
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
import { HeatLaneService } from './heat-lane.service';
import { CreateHeatLaneDto } from './dto/create-heat-lane.dto';
import { UpdateHeatLaneDto } from './dto/update-heat-lane.dto';
import { HeatLane as HeatLaneModel} from '@prisma/client';
import { HeatLane as HeatLaneEntity } from './entities/heat-lane.entity';

@ApiTags('heat-lane')
@Controller('heat-lane')
export class HeatLaneController {
  constructor(private readonly heatLaneService: HeatLaneService) {}

  @Post()
  @ApiOperation({ summary: 'Create heatlane' })
  @ApiParam( {
    name: "lane",
    type: "Integer",
    description: "Lane number",
    example: "1, 2, 3, 4, 5, 6",
    required: true })
  @ApiParam( {
    name: "result",
    type: "Integer",
    description: "result of race",
    example: "1, 2, 3, 4, 5, 6, 99",
    required: true }) 
  @ApiParam( {
    name: "carId",
    type: "Integer",
    description: "unique id of the car",
    example: "1",
    required: false })  
  @ApiParam( {
      name: "heatId",
      type: "Integer",
      description: "non-unique id of the heat; unique in context of a race",
      example: "1",
      required: false }) 
  @ApiParam( {
      name: "raceId",
      type: "Integer",
      description: "unique id of the race",
      example: "1",
      required: false }) 
  @ApiParam( {
      name: "raceType",
      type: "Integer",
      description: "race type code",
      example: "1",
      required: false }) 
  @ApiCreatedResponse({ description: 'HeatLane created successfully', type: HeatLaneEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async create(@Body() createHeatLaneDto: CreateHeatLaneDto) : Promise<HeatLaneModel> {
    return this.heatLaneService.create(createHeatLaneDto);
  }

  @Get()
  @ApiResponse({
      status: 200,
      description: 'All records',
      type: HeatLaneEntity,
  })
  async findAll() : Promise<HeatLaneModel[]> {
    return this.heatLaneService.findAll();
  }

  @Get(':id')
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: HeatLaneEntity,
    })
  async findOne(@Param('id') id: string) : Promise<HeatLaneModel> {
    const oneHeatLane = await this.heatLaneService.findOne(+id);
    if (!oneHeatLane) {
      throw new NotFoundException(`HeatLane with ${id} does not exist.`);
    }
    return oneHeatLane;
  }

  @Get('byType/:raceType')
  @ApiResponse({
      status: 200,
      description: 'The found records based on raceType',
      type: HeatLaneEntity,
    })
  async findRaceType(@Param('raceType') raceType: number) : Promise<HeatLaneModel[]> {
    const returnedHeatLanes = await this.heatLaneService.findRaceType(raceType);
    if (!returnedHeatLanes) {
      throw new NotFoundException(`HeatLanes with ${raceType} does not exist.`);
    }
    return returnedHeatLanes;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update heatlane' })
  @ApiParam( {
    name: "id",
    type: "Integer",
    description: "unique id of the heatlane row",
    example: "1",
    required: true })
  @ApiParam( {
    name: "lane",
    type: "Integer",
    description: "Lane number",
    example: "1, 2, 3, 4, 5, 6",
    required: true })
  @ApiParam( {
    name: "result",
    type: "Integer",
    description: "result of race",
    example: "1, 2, 3, 4, 5, 6, 99",
    required: true }) 
  @ApiParam( {
    name: "carId",
    type: "Integer",
    description: "unique id of the car",
    example: "1",
    required: true })  
  @ApiParam( {
      name: "heatId",
      type: "Integer",
      description: "non-unique id of the heat; unique in context of a race",
      example: "1",
      required: true }) 
  @ApiParam( {
      name: "raceId",
      type: "Integer",
      description: "unique id of the race",
      example: "1",
      required: true }) 
  @ApiParam( {
      name: "raceType",
      type: "Integer",
      description: "race type code",
      example: "1",
      required: true }) 
  @ApiCreatedResponse({ description: 'HeatLane updated successfully', type: HeatLaneEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async update(@Param('id') id: string, @Body() updateHeatLaneDto: UpdateHeatLaneDto) : Promise<HeatLaneModel> {
    const updateHeatLane = await this.heatLaneService.update(+id, updateHeatLaneDto);
    if (!updateHeatLane) {
      throw new NotFoundException(`HeatLane with ${id} does not exist.`);
    }
    return updateHeatLane;
  }

  @Patch(':id/:result')
  @ApiOperation({ summary: 'Update result of a given heatlane id'})
  @ApiParam({
    name: "id",
    type: "Number",
    description: "unique id of the heatlane",
    example: "1",
    required: true
  })
  @ApiParam({
    name: "result",
    type: "Number",
    description: "result of race",
    example: "1",
    required: true
  })
  @ApiCreatedResponse({ description: 'HeatLane updated successfully', type: HeatLaneEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async updateResult(@Param('id') id: number, @Param('result') result: number) : Promise<HeatLaneModel>{
    const updateHeatLane = await this.heatLaneService.updateResult(id, result);
    if (!updateHeatLane) {
      throw new NotFoundException(`HeatLane with ${id} does not exist.`);
    }
    return updateHeatLane;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove HeatLane' })
  @ApiResponse({
    status: 200,
    description: 'The found record was deleted',
    type: HeatLaneEntity,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) : Promise<HeatLaneModel> {
    const deleteHeatLane = await this.heatLaneService.remove(+id);
    if (!deleteHeatLane) {
      throw new NotFoundException(`HeatLane with ${id} does not exist.`);
    }
    return deleteHeatLane;
  }

  @Delete('deleteall/clear')
  @ApiOperation({ summary: 'Clear heatlane table and restart id sequence'})
  async clearHeatLaneTable(): Promise<string> {
    return await this.heatLaneService.clearHeatLaneTable();
  }

   @Post('import')
    @ApiOperation({ summary: 'Import heat-lanes from CSV file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'CSV file containing heat-lane data'
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
      
      return this.heatLaneService.importHeatLanesFromCSV(file.buffer);
    }
}

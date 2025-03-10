import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
    return this.heatLaneService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update heatlane' })
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
  @ApiCreatedResponse({ description: 'HeatLane updated successfully', type: HeatLaneEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async update(@Param('id') id: string, @Body() updateHeatLaneDto: UpdateHeatLaneDto) : Promise<HeatLaneModel> {
    return this.heatLaneService.update(+id, updateHeatLaneDto);
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
    return this.heatLaneService.remove(+id);
  }
}

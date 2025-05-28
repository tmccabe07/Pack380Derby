import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ApiOperation, ApiParam, ApiCreatedResponse, ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { Results as ResultsModel } from '@prisma/client';
import { Results as ResultsEntity } from './entities/results.entity';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create result for a car and race type combination'})
  @ApiParam({
    name: "carId",
    type: "Integer",
    description: "Unique id of a Car",
    example: "1",
    required: true 
  })
  @ApiParam({
    name: "raceType",
    type: "Integer",
    description: "raceType code",
    example: "10",
    required: true
  })
  @ApiCreatedResponse({ description: 'Result of car in a race type created successfully', type: ResultsEntity })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  @ApiResponse({
        status: 200,
        description: 'All records',
        type: ResultsEntity,
    })
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: ResultsEntity,
    })
  async findOne(@Param('id') id: string) : Promise<ResultsModel> {
    const oneResults = await this.resultsService.findOne(+id);
    if (!oneResults) {
      throw new NotFoundException(`Results with ${id} does not exist.`);
    }
    return oneResults;
  }

  @Get('byType/:raceType')
  @ApiResponse({
      status: 200,
      description: 'The found records based on raceType',
      type: ResultsEntity,
    })
  async findRaceType(@Param('raceType') raceType: number) : Promise<ResultsModel[]> {
    const returnedResults = await this.resultsService.findRaceType(raceType);
    if (!returnedResults) {
      throw new NotFoundException(`Results with ${raceType} does not exist.`);
    }
    return returnedResults;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a Results record' })
  @ApiResponse({
    status: 200,
    description: 'The found record was deleted',
    type: ResultsEntity,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) : Promise<ResultsModel> {
    const deleteResults = await this.resultsService.remove(+id);
    if (!deleteResults) {
      throw new NotFoundException(`Results with ${id} does not exist.`);
    }
    return deleteResults;
  }

  @Delete('deleteall/clear')
  @ApiOperation({ summary: 'Clear Results table and restart id sequence'})
  async clearResultsTable(): Promise<string> {
    return await this.resultsService.clearResultsTable();
  }
}

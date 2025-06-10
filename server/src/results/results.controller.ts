import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Results as ResultsEntity } from './entities/results.entity';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate race results based on sumby code and parameters'})
  @ApiParam( {
    name: "sumBy",
    type: "number",
    description: "race type code to filter races from to calculate results",
    example: "10 (sum by carId AND raceType), 20 (sum all cars by raceType AND rank), 30 (sum all cars in all racetypes by rank)",
    required: true })
  @ApiParam( {
    name: "raceType",
    type: "number",
    description: "race type code to filter races from to calculate results",
    example: "0 (ignore race type), 10 (quarterfinal), 20 (semi), 30 (final), 40 (quarterfinaldeadheat), 50 (semideadheat)",
    required: true }) 
  @ApiParam( {
    name: "carId",
    type: "Number",
    description: "unique identifier of the car",
    example: "1",
    required: true })
  @ApiParam({
    name: "rank",
    type: "String",
    description: "rank to calculate results for",
    example: "cub, sibling, adult",
    required: true
  })  
  @ApiResponse({
      status: 200,
      description: 'Returns calculated race results based on the sumby code',
      type: ResultsEntity,
    })
  async getRaceResults(@Body() createResultDto: CreateResultDto): Promise<ResultsEntity[]> {
    return this.resultsService.getRaceResults(createResultDto);
  }
  
}

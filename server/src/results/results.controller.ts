import { Controller, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ResultsResponseDto } from './dto/results-response.dto';
import { RankResultsResponseDto } from './dto/rank-results-response.dto';

@ApiTags('results')
@ApiBearerAuth('bearer')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate race results based on sumby code and parameters'})
  @ApiResponse({
      status: 200,
      description: 'Returns calculated race results based on the sumby code',
      type: ResultsResponseDto,
      isArray: true
    })
  async getRaceResults(@Body() createResultDto: CreateResultDto): Promise<ResultsResponseDto[]> {
    return this.resultsService.getRaceResults(createResultDto);
  }

  @Get('by-rank/:raceType/:rank')
  @ApiOperation({ summary: 'Get summed places for all cars by rank and race type, with 100 added to each place' })
  @ApiParam({
    name: 'rank',
    description: 'The rank to get results for',
    example: 'cub',
    enum: ['cub', 'sibling', 'adult'],
  })
  @ApiParam({
    name: 'raceType',
    description: 'Race type code (10=preliminary, 20=semi, 30=final, 40=preliminarydeadheat, 50=semideadheat)',
    example: 10,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns summed places for all cars in the specified rank and race type',
    type: RankResultsResponseDto,
    isArray: true,
  })
  async getResultsByRank(
    @Param('raceType', ParseIntPipe) raceType: number,
    @Param('rank') rank: string
  ): Promise<RankResultsResponseDto[]> {
    return this.resultsService.getResultsByRank(rank, raceType);
  }

  @Get('final-by-rank/:rank')
  @ApiOperation({ summary: 'Get top result by rank across all races, excluding cars that are in finals' })
  @ApiParam({
    name: 'rank',
    description: 'The rank to get results for',
    example: 'lion',
    enum: ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol', 'cub', 'sibling', 'adult'],
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the top result(s) for the specified rank across all race types, excluding cars in finals. Returns all cars if there is a tie for the best score.',
    type: RankResultsResponseDto,
    isArray: true,
  })
  async getFinalResultsByRank(
    @Param('rank') rank: string
  ): Promise<RankResultsResponseDto[]> {
    return this.resultsService.getFinalResultsByRank(rank);
  }
  
}

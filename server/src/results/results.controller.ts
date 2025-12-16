import { Controller, Get, Query, Param } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UnifiedResultsResponseDto } from './dto/unified-results-response.dto';
import { RankResultsResponseDto } from './dto/rank-results-response.dto';

@ApiTags('results')
@ApiBearerAuth('bearer')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get weighted total results with flexible filtering',
    description: `
      Returns weighted total results for all cars in all heatlanes based on the include parameter.
      
      Examples:
      - ?include=cub - All results for racerType=cub
      - ?include=sibling - All results for racerType=sibling
      - ?include=adult - All results for racerType=adult
      - ?include=cub,10 - Results for racerType=cub and raceType=10
      - ?include=10 - All results for raceType=10
      - ?include=lion - All results for rank=lion
      - ?include=lion,10 - Results for rank=lion and raceType=10
      - ?include=cub&exclude=30 - Results for racerType=cub excluding raceType=30
      - ?include=lion&exclude=10,20 - Results for rank=lion excluding raceTypes 10 and 20
      
      The weighted total is calculated as: sum of (result * 100) for each heat.
      Lower weighted totals indicate better performance.
    `
  })
  @ApiQuery({
    name: 'include',
    description: 'Comma-separated filter values. Can be: racerType (cub/sibling/adult), raceType (10/20/30/40/50), rank (lion/tiger/wolf/bear/webelos/aol), or combinations like "cub,10" or "lion,20"',
    example: 'cub',
    required: true,
  })
  @ApiQuery({
    name: 'exclude',
    description: 'Comma-separated raceType values to exclude (10/20/30/40/50). Example: "30" or "10,20"',
    example: '30',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns weighted total results based on the specified filters',
    type: UnifiedResultsResponseDto,
    isArray: true,
  })
  async getResults(
    @Query('include') include: string,
    @Query('exclude') exclude?: string
  ): Promise<UnifiedResultsResponseDto[]> {
    return this.resultsService.getUnifiedResults(include, exclude);
  }

  @Get('best-of-the-rest/:rank')
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
  async getBestOfTheRest(
    @Param('rank') rank: string
  ): Promise<RankResultsResponseDto[]> {
    return this.resultsService.getBestOfTheRest(rank);
  }
}

import { Controller, Get, Body } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultsResponseDto } from './dto/results-response.dto';

@ApiTags('results')
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
  
}

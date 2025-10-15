import { Controller, Get, Post, Put, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompetitionService } from './competition.service';
import { SetLanesDto } from './dto/set-lanes.dto';

@ApiTags('competition')
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get('numlanes')
  @ApiOperation({ summary: 'Get number of lanes' })
  @ApiResponse({ status: 200, description: 'Number of lanes retrieved successfully' })
  getNumLanes() {
    try {
      const numLanes = this.competitionService.getNumLanes();
      return { numLanes };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('numlanes')
  @ApiOperation({ summary: 'Set number of lanes' })
  @ApiResponse({ status: 200, description: 'Number of lanes set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid number of lanes' })
  setNumLanes(@Body() setLanesDto: SetLanesDto) {
    try {
      const numLanes = this.competitionService.setNumLanes(setLanesDto.numLanes);
      return { numLanes };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('numlanes')
  @ApiOperation({ summary: 'Update number of lanes' })
  @ApiResponse({ status: 200, description: 'Number of lanes updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid number of lanes' })
  updateNumLanes(@Body() setLanesDto: SetLanesDto) {
    try {
      const numLanes = this.competitionService.updateNumLanes(setLanesDto.numLanes);
      return { numLanes };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

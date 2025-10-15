import { Controller, Get, Post, Put, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompetitionService } from './competition.service';
import { SetLanesDto } from './dto/set-lanes.dto';
import { SetTotalLanesDto } from './dto/set-total-lanes.dto';
import { SetUsableLanesDto } from './dto/set-usable-lanes.dto';

@ApiTags('competition')
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  // Combined lane configuration endpoints
  @Get('configuration')
  @ApiOperation({ summary: 'Get complete lane configuration' })
  @ApiResponse({ status: 200, description: 'Lane configuration retrieved successfully' })
  getLaneConfiguration() {
    try {
      return this.competitionService.getLaneConfiguration();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('configuration')
  @ApiOperation({ summary: 'Set complete lane configuration' })
  @ApiResponse({ status: 200, description: 'Lane configuration set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid lane configuration' })
  setLaneConfiguration(@Body() setLanesDto: SetLanesDto) {
    try {
      const result = this.competitionService.setLaneConfiguration(setLanesDto.numLanes, setLanesDto.usableLanes);
      return { ...result, usableLaneCount: result.usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('configuration')
  @ApiOperation({ summary: 'Update complete lane configuration' })
  @ApiResponse({ status: 200, description: 'Lane configuration updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid lane configuration' })
  updateLaneConfiguration(@Body() setLanesDto: SetLanesDto) {
    try {
      const result = this.competitionService.setLaneConfiguration(setLanesDto.numLanes, setLanesDto.usableLanes);
      return { ...result, usableLaneCount: result.usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Total lanes endpoints
  @Get('total-lanes')
  @ApiOperation({ summary: 'Get total number of lanes' })
  @ApiResponse({ status: 200, description: 'Total lanes retrieved successfully' })
  getTotalLanes() {
    try {
      const numLanes = this.competitionService.getNumLanes();
      return { numLanes };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('total-lanes')
  @ApiOperation({ summary: 'Set total number of lanes' })
  @ApiResponse({ status: 200, description: 'Total lanes set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid number of lanes' })
  setTotalLanes(@Body() setTotalLanesDto: SetTotalLanesDto) {
    try {
      const numLanes = this.competitionService.setNumLanes(setTotalLanesDto.numLanes);
      const usableLanes = this.competitionService.getUsableLanes();
      return { numLanes, usableLanes, usableLaneCount: usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('total-lanes')
  @ApiOperation({ summary: 'Update total number of lanes' })
  @ApiResponse({ status: 200, description: 'Total lanes updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid number of lanes' })
  updateTotalLanes(@Body() setTotalLanesDto: SetTotalLanesDto) {
    try {
      const numLanes = this.competitionService.updateNumLanes(setTotalLanesDto.numLanes);
      const usableLanes = this.competitionService.getUsableLanes();
      return { numLanes, usableLanes, usableLaneCount: usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Usable lanes endpoints
  @Get('usable-lanes')
  @ApiOperation({ summary: 'Get usable lanes' })
  @ApiResponse({ status: 200, description: 'Usable lanes retrieved successfully' })
  getUsableLanes() {
    try {
      const usableLanes = this.competitionService.getUsableLanes();
      const usableLaneCount = this.competitionService.getUsableLaneCount();
      return { usableLanes, usableLaneCount };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('usable-lanes')
  @ApiOperation({ summary: 'Set usable lanes' })
  @ApiResponse({ status: 200, description: 'Usable lanes set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid usable lanes' })
  setUsableLanes(@Body() setUsableLanesDto: SetUsableLanesDto) {
    try {
      const usableLanes = this.competitionService.setUsableLanes(setUsableLanesDto.usableLanes);
      return { usableLanes, usableLaneCount: usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('usable-lanes')
  @ApiOperation({ summary: 'Update usable lanes' })
  @ApiResponse({ status: 200, description: 'Usable lanes updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid usable lanes' })
  updateUsableLanes(@Body() setUsableLanesDto: SetUsableLanesDto) {
    try {
      const usableLanes = this.competitionService.updateUsableLanes(setUsableLanesDto.usableLanes);
      return { usableLanes, usableLaneCount: usableLanes.length };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

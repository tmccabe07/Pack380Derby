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
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HeatLaneService } from './heat-lane.service';
import { CreateHeatLaneDto } from './dto/create-heat-lane.dto';
import { UpdateHeatLaneDto } from './dto/update-heat-lane.dto';
import { HeatLane as HeatLaneModel} from '@prisma/client';
import { HeatLaneResponseDto } from './dto/heat-lane-response.dto';

@ApiTags('heat-lane')
@ApiBearerAuth('bearer')
@Controller('heat-lane')
export class HeatLaneController {
  constructor(private readonly heatLaneService: HeatLaneService) {}

  @Post()
  @ApiOperation({ summary: 'Create heatlane' })
  @ApiCreatedResponse({ description: 'HeatLane created successfully', type: HeatLaneResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async create(@Body() createHeatLaneDto: CreateHeatLaneDto) : Promise<HeatLaneModel> {
    return this.heatLaneService.create(createHeatLaneDto);
  }

  @Get()
  @ApiResponse({
      status: 200,
      description: 'All records',
      type: HeatLaneResponseDto,
      isArray: true
  })
  async findAll() : Promise<HeatLaneModel[]> {
    return this.heatLaneService.findAll();
  }

  @Get(':id')
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: HeatLaneResponseDto
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
      type: HeatLaneResponseDto,
      isArray: true
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
  @ApiCreatedResponse({ description: 'HeatLane updated successfully', type: HeatLaneResponseDto })
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
  @ApiCreatedResponse({ description: 'HeatLane updated successfully', type: HeatLaneResponseDto })
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
    type: HeatLaneResponseDto
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

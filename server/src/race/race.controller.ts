import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe, 
  NotFoundException
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RaceService } from './race.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { Race } from '@prisma/client';
import { RaceResponseDto } from './dto/race-response.dto';

@ApiTags('race')
@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all races'})
  @ApiResponse({
    status: 200,
    description: 'List of all races',
    type: RaceResponseDto,
    isArray: true
  })
  async findAll(): Promise<Race[]>  {
    return await this.raceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get race by race id'})
  @ApiResponse({
    status: 200,
    description: 'The found race',
    type: RaceResponseDto
  })
  async findOne(@Param('id') id: string): Promise<Race> {
    return await this.raceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update race by race id'})
  @ApiResponse({
    status: 200,
    description: 'The updated race',
    type: RaceResponseDto
  })
  async update(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return await this.raceService.update(+id, updateRaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete race by race id'})
  @ApiResponse({
    status: 200,
    description: 'The deleted race',
    type: RaceResponseDto
  })
  async remove(@Param('id') id: string) {
    return await this.raceService.remove(+id);
  }

  @Delete('deleteall/clear')
  @ApiOperation({ summary: 'Clear race table and restart id sequence'})
  async clearRaceTable(): Promise<string> {
    return await this.raceService.clearRaceTable();
  }
  
  @Post()
  @ApiOperation({ summary: 'Create quarterfinal, semifinal or final race, with heats, including any needed deadheats' })
  @ApiCreatedResponse({ description: 'Semi or Final Race created successfully', type: RaceResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async createRaceAndHeats(@Body() createRaceDto: CreateRaceDto) {
    return await this.raceService.createRaceAndHeats(createRaceDto);
  }

  @Post('import')
    @ApiOperation({ summary: 'Import racers from CSV file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'CSV file containing race data'
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
      
      return this.raceService.importRacesFromCSV(file.buffer);
    }
 

  @Get(':id/heats')
  @ApiOperation({ summary: 'Get all heats for a specific race' })
  @ApiResponse({
    status: 200,
    description: 'All heat lanes for the specified race',
    isArray: true
  })
  async findHeatsForRace(@Param('id', ParseIntPipe) id: number) {
    
    // First verify the race exists
    const race = await this.raceService.findOne(id);
    if (!race) {
      throw new NotFoundException(`Race with ID ${id} does not exist.`);
    }

    const heats = await this.raceService.findHeatsForRace(id);
 
    return heats;
  }

  @Get(':raceId/heat/:heatId')
  @ApiOperation({ summary: 'Get heat lanes for a specific heat within a race' })
  @ApiResponse({
    status: 200,
    description: 'Heat lanes for the specified heat and race',
    isArray: true
  })
  async findHeatLanesByHeatAndRace(
    @Param('raceId', ParseIntPipe) raceId: number,
    @Param('heatId', ParseIntPipe) heatId: number
  ) {
    // First verify the race exists
    const race = await this.raceService.findOne(raceId);
    if (!race) {
      throw new NotFoundException(`Race with ID ${raceId} does not exist.`);
    }

    const heatLanes = await this.raceService.findHeatLanesByHeatAndRace(heatId, raceId);
    
    if (heatLanes.length === 0) {
      throw new NotFoundException(`No heat lanes found for heat ID ${heatId} in race ID ${raceId}.`);
    }

    return heatLanes;
  }
}

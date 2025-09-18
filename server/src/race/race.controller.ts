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
  BadRequestException 
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

}

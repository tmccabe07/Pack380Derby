import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  NotFoundException, 
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRacerDto } from './dto/create-racer.dto';
import { UpdateRacerDto } from './dto/update-racer.dto';
import { Racer as RacerModel} from '@prisma/client';
import { RacerService } from './racer.service';
import { RacerResponseDto } from './dto/racer-response.dto';


@ApiTags('racer')
@ApiBearerAuth('bearer')
@Controller('racer')
export class RacerController {
  constructor(private racerService: RacerService) {}

  @Post()
  @ApiOperation({ summary: 'Create racer' })
  @ApiCreatedResponse({ description: 'racer created successfully', type: RacerResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createRacerDto: CreateRacerDto): Promise<RacerModel> {
    return this.racerService.createRacer(createRacerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All records',
    type: RacerResponseDto,
    isArray: true
  })
  async findAll(): Promise<RacerModel[]> {
    return this.racerService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search racers by name' })
  @ApiResponse({
    status: 200,
    description: 'Racers matching search query',
    type: RacerResponseDto,
    isArray: true,
  })
  async search(@Query('q') q: string): Promise<RacerModel[]> {
    return await this.racerService.searchByName(q);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RacerResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RacerModel> {
    const oneRacer = await this.racerService.findOne(+id);
    if (!oneRacer) {
      throw new NotFoundException(`Racer with ${id} does not exist.`);
    }
    return oneRacer;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove racer' })
  @ApiResponse({
    status: 200,
    description: 'The found record was deleted',
    type: RacerResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id', ParseIntPipe) id: number) : Promise<RacerModel> {
    const deleteRacer = await this.racerService.remove(+id);
    if (!deleteRacer) {
      throw new NotFoundException(`Racer with ${id} does not exist.`);
    }
    return deleteRacer;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update racer' })
  @ApiCreatedResponse({ description: 'Racer updated successfully', type: RacerResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRacerDto: UpdateRacerDto,
  ): Promise<RacerModel> {
    const updateRacer = await this.racerService.update(+id, updateRacerDto);
    if (!updateRacer) {
      throw new NotFoundException(`Racer with ${id} does not exist.`);
    }
    return updateRacer;
  }

  @Delete('deleteall/clear')
  @ApiOperation({ summary: 'Clear racer table and restart id sequence'})
  async clearPacerTable(): Promise<string> {
    return await this.racerService.clearRacerTable();
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
          description: 'CSV file containing racer data'
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
    
    return this.racerService.importRacersFromCSV(file.buffer);
  }
}
function search(arg0: any, q: any, string: any) {
  throw new Error('Function not implemented.');
}


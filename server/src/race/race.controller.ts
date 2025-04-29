import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RaceService } from './race.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { Race } from '@prisma/client';

@ApiTags('race')
@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create race' })
  async create(@Body() createRaceDto: CreateRaceDto): Promise<Race> {
    return await this.raceService.create(createRaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all races'})
  async findAll(): Promise<Race[]>  {
    return await this.raceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get race by race id'})
  async findOne(@Param('id') id: string): Promise<Race> {
    return await this.raceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update race by race id'})
  async update(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return await this.raceService.update(+id, updateRaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete race by race id'})
  async remove(@Param('id') id: string) {
    return await this.raceService.remove(+id);
  }

  @Post('raceandheats')
  @ApiOperation({ summary: 'Create semifinal or final race, including any needed deadheats' })
  @ApiParam( {
      name: "raceId",
      type: "Number",
      description: "Desired number of race, note this isn't used",
      example: "1, 2, 3, 4, 5, 6",
      required: true 
  })
  @ApiParam( {
    name: "raceName",
    type: "String",
    description: "name of race to generate new race from",
    example: "quarterfinals, quarterfinalsdeadHeat, semi, semideadHeat",
    required: true }) 
  @ApiParam( {
    name: "numLanes",
    type: "Number",
    description: "number of valid lanes per heat",
    example: "6",
    required: true })
  @ApiParam({
    name: "role",
    type: "String",
    description: "role to filter table by",
    example: "Cub, Sibling, Adult",
    required: true
  })  
  @ApiCreatedResponse({ description: 'Semi or Final Race created successfully', type: CreateRaceDto })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async createRaceAndHeats(@Body() createRaceDto: CreateRaceDto) {
    return await this.raceService.createRaceAndHeats(createRaceDto);
  }

}

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

@ApiTags('race')
@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create quarterfinals race' })
  @ApiParam( {
      name: "raceId",
      type: "Number",
      description: "Desired number of race",
      example: "1, 2, 3, 4, 5, 6",
      required: true 
  })
  @ApiParam( {
    name: "raceName",
    type: "String",
    description: "name of new race",
    example: "quarterfinals",
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
  @ApiCreatedResponse({ description: 'Race created successfully', type: CreateRaceDto })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async create(@Body() createRaceDto: CreateRaceDto) {
    return await this.raceService.create(createRaceDto);
  }

  @Post('semiorfinal')
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
  @ApiCreatedResponse({ description: 'Race created successfully', type: CreateRaceDto })
  @ApiBadRequestResponse({ description: 'Bad Request' }) 
  async createSemiorFinal(@Body() createRaceDto: CreateRaceDto) {
    return await this.raceService.createSemiorFinal(createRaceDto);
  }

  @Get()
  findAll() {
    return this.raceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return this.raceService.update(+id, updateRaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raceService.remove(+id);
  }
}

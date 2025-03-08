import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HeatLaneService } from './heat-lane.service';
import { CreateHeatLaneDto } from './dto/create-heat-lane.dto';
import { UpdateHeatLaneDto } from './dto/update-heat-lane.dto';

@Controller('heat-lane')
export class HeatLaneController {
  constructor(private readonly heatLaneService: HeatLaneService) {}

  @Post()
  create(@Body() createHeatLaneDto: CreateHeatLaneDto) {
    return this.heatLaneService.create(createHeatLaneDto);
  }

  @Get()
  findAll() {
    return this.heatLaneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heatLaneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeatLaneDto: UpdateHeatLaneDto) {
    return this.heatLaneService.update(+id, updateHeatLaneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heatLaneService.remove(+id);
  }
}

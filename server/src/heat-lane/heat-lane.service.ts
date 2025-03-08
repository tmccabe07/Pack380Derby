import { Injectable } from '@nestjs/common';
import { CreateHeatLaneDto } from './dto/create-heat-lane.dto';
import { UpdateHeatLaneDto } from './dto/update-heat-lane.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HeatLane, Prisma } from '@prisma/client';

@Injectable()
export class HeatLaneService {
  create(createHeatLaneDto: CreateHeatLaneDto) {
    return 'This action adds a new heatLane';
  }

  findAll() {
    return `This action returns all heatLane`;
  }

  findOne(id: number) {
    return `This action returns a #${id} heatLane`;
  }

  update(id: number, updateHeatLaneDto: UpdateHeatLaneDto) {
    return `This action updates a #${id} heatLane`;
  }

  remove(id: number) {
    return `This action removes a #${id} heatLane`;
  }
}

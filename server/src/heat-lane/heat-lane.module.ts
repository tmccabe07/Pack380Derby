import { Module } from '@nestjs/common';
import { HeatLaneService } from './heat-lane.service';
import { HeatLaneController } from './heat-lane.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HeatLaneController],
  providers: [HeatLaneService, PrismaService],
  exports: [HeatLaneService]
})
export class HeatLaneModule {}

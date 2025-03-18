import { Module } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RaceController],
  providers: [RaceService, PrismaService],
  imports: [HeatLaneModule]
})
export class RaceModule {}

import { Module } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { PrismaService } from '../prisma/prisma.service';
import { RaceGlobalVariableService } from './raceGlobalVariable.service';

@Module({
  controllers: [RaceController],
  providers: [RaceService, PrismaService, RaceGlobalVariableService],
  imports: [HeatLaneModule],
  exports: [RaceGlobalVariableService]
})
export class RaceModule {}

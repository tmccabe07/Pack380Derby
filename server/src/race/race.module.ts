import { Module } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { PrismaService } from '../prisma/prisma.service';
import { SemiGlobalVariableService } from './semi.service';

@Module({
  controllers: [RaceController],
  providers: [RaceService, PrismaService, SemiGlobalVariableService],
  imports: [HeatLaneModule],
  exports: [SemiGlobalVariableService]
})
export class RaceModule {}

import { Module } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { PrismaService } from '../prisma/prisma.service';
import { RaceGlobalVariableService } from './raceGlobalVariable.service';
import { race } from 'rxjs';
import { RaceGenerationService } from './services/race-generation.service';
import { RaceProgressionService } from './services/race-progression.service';

@Module({
  controllers: [RaceController],
  providers: [RaceService, PrismaService, RaceGlobalVariableService, RaceGenerationService, RaceProgressionService],
  imports: [HeatLaneModule],
  exports: [RaceGlobalVariableService, RaceService]
})
export class RaceModule {}

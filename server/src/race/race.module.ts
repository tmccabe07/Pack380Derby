import { Module } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { PrismaService } from '../prisma/prisma.service';
import { RaceGenerationService } from './services/race-generation.service';
import { RaceProgressionService } from './services/race-progression.service';

@Module({
  controllers: [RaceController],
  providers: [RaceService, PrismaService, RaceGenerationService, RaceProgressionService],
  imports: [HeatLaneModule],
  exports: [RaceService]
})
export class RaceModule {}

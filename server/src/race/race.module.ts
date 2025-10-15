import { Module } from '@nestjs/common';
import { RaceController } from './race.controller';
import { RaceService } from './race.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionModule } from '../competition/competition.module';
import { HeatLaneModule } from '../heat-lane/heat-lane.module'
import { RaceGenerationService } from './services/race-generation.service';
import { RaceProgressionService } from './services/race-progression.service';

@Module({
  imports: [HeatLaneModule, CompetitionModule],
  controllers: [RaceController],
  providers: [RaceService, RaceGenerationService, RaceProgressionService, PrismaService],
  exports: [RaceService],
})
export class RaceModule {}

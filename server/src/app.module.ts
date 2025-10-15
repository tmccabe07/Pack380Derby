import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RacerModule } from './racer/racer.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CarModule } from './car/car.module';
import { HeatLaneModule } from './heat-lane/heat-lane.module';
import { RaceModule } from './race/race.module';
import { ResultsModule } from './results/results.module';
import { VotingModule } from './voting/voting.module';
import { CompetitionModule } from './competition/competition.module';
import { configuration } from '../configuration';

@Module({
  imports: [RacerModule, ConfigModule.forRoot(
    { 
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration] 
    }
  ), PrismaModule, CarModule, HeatLaneModule, RaceModule, ResultsModule, VotingModule, CompetitionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

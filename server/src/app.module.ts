import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CarModule } from './car/car.module';
import { HeatLaneModule } from './heat-lane/heat-lane.module';
import { RaceModule } from './race/race.module';

@Module({
  imports: [PersonModule, ConfigModule.forRoot(), PrismaModule, CarModule, HeatLaneModule, RaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

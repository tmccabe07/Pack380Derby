import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [PersonModule, ConfigModule.forRoot(), PrismaModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

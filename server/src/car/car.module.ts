import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { PrismaService } from '../prisma/prisma.service';
import { CarController } from './car.controller';

@Module({
  controllers: [CarController],
  providers: [CarService, PrismaService],
  exports: [CarService]
})
export class CarModule {}

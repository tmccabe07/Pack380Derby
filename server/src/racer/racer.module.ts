import { Module } from '@nestjs/common';
import { RacerService } from './racer.service';
import { PrismaService } from '../prisma/prisma.service';
import { RacerController } from './racer.controller';

@Module({
  controllers: [RacerController],
  providers: [RacerService, PrismaService],
  exports: [RacerService]
})
export class RacerModule {}

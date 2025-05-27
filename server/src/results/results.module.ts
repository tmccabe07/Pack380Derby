import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResultsController } from './results.controller';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, PrismaService],
  exports: [ResultsModule]
})
export class ResultsModule {}

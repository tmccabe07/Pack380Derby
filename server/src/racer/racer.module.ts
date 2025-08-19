import { Module } from '@nestjs/common';
import { RacerService } from './racer.service';
import { PrismaService } from '../prisma/prisma.service';
import { RacerController } from './racer.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register()],
  controllers: [RacerController],
  providers: [RacerService, PrismaService],
  exports: [RacerService]
})
export class RacerModule {}

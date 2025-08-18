import { Module } from '@nestjs/common';
import { VotingController } from './voting.controller';
import { VotingService } from './voting.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [VotingController],
    providers: [VotingService, PrismaService],
    exports: [VotingService],
})
export class VotingModule {}

import { Module } from '@nestjs/common';
import { PersonService } from '../prisma/person.service';
import { PrismaService } from '../prisma/prisma.service';
import { PersonController } from './person.controller';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService],
  exports: [PersonService]
})
export class PersonModule {}

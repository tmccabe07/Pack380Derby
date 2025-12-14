#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all data from all tables (order matters for foreign keys)
  await prisma.vote.deleteMany({});
  await prisma.voteCategory.deleteMany({});
  await prisma.heatLane.deleteMany({});
  await prisma.race.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.racer.deleteMany({});
  // Add more tables as needed
  console.log('All data cleared.');
}

void main().finally(() => prisma.$disconnect());

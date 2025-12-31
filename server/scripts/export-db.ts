#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();


async function main() {
  const exportDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  // Get filename suffix from command line argument
  const suffix = process.argv[2] ? `_${process.argv[2]}` : '';

  // Export each table to a JSON file
  const tables = [
    { name: 'car', data: await prisma.car.findMany() },
    { name: 'racer', data: await prisma.racer.findMany() },
    { name: 'vote', data: await prisma.vote.findMany() },
    { name: 'voteCategory', data: await prisma.voteCategory.findMany() },
    { name: 'heatlane', data: await prisma.heatLane.findMany() },
    { name: 'race', data: await prisma.race.findMany() },
    // All models in schema.prisma are now included
  ];

  for (const table of tables) {
    const file = path.join(exportDir, `${table.name}${suffix}.json`);
    fs.writeFileSync(file, JSON.stringify(table.data, null, 2));
    console.log(`Exported ${table.name} to ${file}`);
  }
}

void main().finally(() => prisma.$disconnect());

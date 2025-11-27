#!/usr/bin/env ts-node
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: load-db.ts <filename> <table>');
    process.exit(1);
  }
  const [filename, table] = args;
  const filePath = path.resolve(__dirname, '../../data', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(data)) {
    console.error('JSON file must contain an array of objects');
    process.exit(1);
  }
  // Clear table before loading
  // @ts-ignore
  await prisma[table].deleteMany({});
  // Insert data
  // @ts-ignore
  await prisma[table].createMany({ data });
  console.log(`Loaded ${data.length} records into ${table}`);
}

main().finally(() => prisma.$disconnect());

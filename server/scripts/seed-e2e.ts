#!/usr/bin/env ts-node
/**
 * Resets the database and loads a small synthetic event for end-to-end tests.
 *
 * DESTRUCTIVE: every table is emptied. The script refuses to run unless the
 * database name in DATABASE_URL contains "e2e" or "test".
 *
 * Usage: DATABASE_URL=postgresql://.../pinewood_derby_e2e npx ts-node scripts/seed-e2e.ts
 */
import { PrismaClient } from '@prisma/client';

const RANKS = ['lion', 'tiger', 'wolf', 'bear', 'webelos', 'aol'];
const NAMES = [
  'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot',
  'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
];

function assertDisposableDatabase(): void {
  const url = process.env.DATABASE_URL ?? '';
  let name = '';
  try {
    name = new URL(url).pathname.replace(/^\//, '');
  } catch {
    // fall through with an empty name
  }
  if (!/(e2e|test)/i.test(name)) {
    console.error(
      `Refusing to seed: database "${name || '(unset)'}" is not a test database. ` +
        'The name must contain "e2e" or "test".',
    );
    process.exit(1);
  }
}

async function main() {
  assertDisposableDatabase();
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Vote", "VoteCategory", "HeatLane", "Race", "Car", "Racer" RESTART IDENTITY CASCADE',
    );

    // Twelve cub cars: exactly two full heats on a six-lane track, two per rank.
    for (let i = 0; i < NAMES.length; i++) {
      await prisma.racer.create({
        data: {
          name: `Scout ${NAMES[i]}`,
          den: String((i % 3) + 1),
          rank: RANKS[i % RANKS.length],
          racerType: 'cub',
          car: { create: { name: `Cub Car ${NAMES[i]}`, weight: '5.0', year: 2027 } },
        },
      });
    }
    for (const [racerType, label] of [['sibling', 'Sibling'], ['adult', 'Adult']] as const) {
      for (let i = 0; i < 3; i++) {
        await prisma.racer.create({
          data: {
            name: `${label} ${NAMES[i]}`,
            rank: racerType,
            racerType,
            car: { create: { name: `${label} Car ${NAMES[i]}`, weight: '5.0', year: 2027 } },
          },
        });
      }
    }
    // A scout on the roster who has not registered a car yet.
    await prisma.racer.create({
      data: { name: 'Scout Zulu', den: '1', rank: 'wolf', racerType: 'cub' },
    });

    await prisma.voteCategory.createMany({
      data: [
        { name: 'Most Creative', description: 'The most imaginative design' },
        { name: 'Best Paint Job', description: 'The best finish' },
      ],
    });

    const [racers, cars] = await Promise.all([prisma.racer.count(), prisma.car.count()]);
    console.log(`Seeded ${racers} racers, ${cars} cars and 2 voting categories.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

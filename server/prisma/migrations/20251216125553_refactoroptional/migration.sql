/*
  Warnings:

  - Made the column `name` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `racerId` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carId` on table `HeatLane` required. This step will fail if there are existing NULL values in that column.
  - Made the column `heatId` on table `HeatLane` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceId` on table `HeatLane` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceType` on table `HeatLane` required. This step will fail if there are existing NULL values in that column.
  - Made the column `racerType` on table `HeatLane` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceName` on table `Race` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceType` on table `Race` required. This step will fail if there are existing NULL values in that column.
  - Made the column `racerType` on table `Race` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Racer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `racerType` on table `Racer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Car" DROP CONSTRAINT "Car_racerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HeatLane" DROP CONSTRAINT "HeatLane_carId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HeatLane" DROP CONSTRAINT "HeatLane_raceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_voterId_fkey";

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "racerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "HeatLane" ALTER COLUMN "carId" SET NOT NULL,
ALTER COLUMN "heatId" SET NOT NULL,
ALTER COLUMN "raceId" SET NOT NULL,
ALTER COLUMN "raceType" SET NOT NULL,
ALTER COLUMN "racerType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Race" ALTER COLUMN "raceName" SET NOT NULL,
ALTER COLUMN "raceType" SET NOT NULL,
ALTER COLUMN "racerType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Racer" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "racerType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "voterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeatLane" ADD CONSTRAINT "HeatLane_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeatLane" ADD CONSTRAINT "HeatLane_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Racer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

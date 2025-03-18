/*
  Warnings:

  - You are about to drop the `Heat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HeatLane" DROP CONSTRAINT "HeatLane_heatId_fkey";

-- AlterTable
ALTER TABLE "HeatLane" ADD COLUMN     "raceId" INTEGER,
ALTER COLUMN "heatId" DROP NOT NULL;

-- DropTable
DROP TABLE "Heat";

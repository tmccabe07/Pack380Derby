/*
  Warnings:

  - You are about to drop the column `raceId` on the `Results` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Results" DROP CONSTRAINT "Results_raceId_fkey";

-- AlterTable
ALTER TABLE "Results" DROP COLUMN "raceId",
ADD COLUMN     "raceType" INTEGER;

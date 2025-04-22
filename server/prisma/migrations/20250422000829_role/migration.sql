/*
  Warnings:

  - You are about to drop the column `raceRole` on the `RaceMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RaceMetadata" DROP COLUMN "raceRole",
ADD COLUMN     "role" VARCHAR(30);

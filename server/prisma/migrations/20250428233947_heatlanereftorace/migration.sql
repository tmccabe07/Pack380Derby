/*
  Warnings:

  - You are about to drop the column `raceName` on the `HeatLane` table. All the data in the column will be lost.
  - You are about to drop the column `raceRole` on the `HeatLane` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HeatLane" DROP COLUMN "raceName",
DROP COLUMN "raceRole",
ADD COLUMN     "raceType" INTEGER,
ADD COLUMN     "role" TEXT;

-- AddForeignKey
ALTER TABLE "HeatLane" ADD CONSTRAINT "HeatLane_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE SET NULL ON UPDATE CASCADE;

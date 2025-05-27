/*
  Warnings:

  - A unique constraint covering the columns `[carIdandRaceType]` on the table `Results` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Results" ADD COLUMN     "carIdandRaceType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Results_carIdandRaceType_key" ON "Results"("carIdandRaceType");

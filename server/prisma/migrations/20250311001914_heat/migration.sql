/*
  Warnings:

  - Added the required column `heatId` to the `HeatLane` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HeatLane" ADD COLUMN     "heatId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Heat" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Heat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HeatLane" ADD CONSTRAINT "HeatLane_heatId_fkey" FOREIGN KEY ("heatId") REFERENCES "Heat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

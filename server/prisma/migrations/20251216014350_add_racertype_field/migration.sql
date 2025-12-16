/*
  Warnings:

  - You are about to drop the column `rank` on the `HeatLane` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Race` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HeatLane" DROP COLUMN "rank",
ADD COLUMN     "racerType" TEXT;

-- AlterTable
ALTER TABLE "Race" DROP COLUMN "rank",
ADD COLUMN     "racerType" VARCHAR(30);

-- AlterTable
ALTER TABLE "Racer" ADD COLUMN     "racerType" VARCHAR(30);

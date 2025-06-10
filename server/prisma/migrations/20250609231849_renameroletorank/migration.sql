/*
  Warnings:

  - You are about to drop the column `role` on the `HeatLane` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Race` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HeatLane" DROP COLUMN "role",
ADD COLUMN     "rank" TEXT;

-- AlterTable
ALTER TABLE "Race" DROP COLUMN "role",
ADD COLUMN     "rank" VARCHAR(30);

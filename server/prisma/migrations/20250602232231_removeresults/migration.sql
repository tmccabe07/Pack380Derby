/*
  Warnings:

  - You are about to drop the `Results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Results" DROP CONSTRAINT "Results_carId_fkey";

-- DropTable
DROP TABLE "Results";

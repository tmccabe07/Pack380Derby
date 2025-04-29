/*
  Warnings:

  - You are about to drop the column `racerId` on the `Car` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personId]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_racerId_fkey";

-- DropIndex
DROP INDEX "Car_racerId_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "racerId",
ADD COLUMN     "personId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Car_personId_key" ON "Car"("personId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

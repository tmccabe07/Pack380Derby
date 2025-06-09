/*
  Warnings:

  - You are about to drop the column `personId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[racerId]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_personId_fkey";

-- DropIndex
DROP INDEX "Car_personId_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "personId",
ADD COLUMN     "racerId" INTEGER;

-- DropTable
DROP TABLE "Person";

-- CreateTable
CREATE TABLE "Racer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "den" VARCHAR(30),
    "rank" VARCHAR(30),
    "role" VARCHAR(30),

    CONSTRAINT "Racer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_racerId_key" ON "Car"("racerId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Racer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

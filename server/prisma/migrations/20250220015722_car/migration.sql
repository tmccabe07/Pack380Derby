/*
  Warnings:

  - The primary key for the `Person` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `person_id` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP CONSTRAINT "Person_pkey",
DROP COLUMN "person_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "weight" VARCHAR(30),
    "racerId" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_racerId_key" ON "Car"("racerId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

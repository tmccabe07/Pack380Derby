/*
  Warnings:

  - You are about to drop the `RaceMetadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RaceMetadata";

-- CreateTable
CREATE TABLE "Race" (
    "id" SERIAL NOT NULL,
    "raceName" VARCHAR(255),
    "raceType" INTEGER,
    "role" VARCHAR(30),
    "numLanes" INTEGER NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

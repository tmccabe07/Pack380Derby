-- CreateTable
CREATE TABLE "RaceMetadata" (
    "id" SERIAL NOT NULL,
    "raceName" VARCHAR(255),
    "raceRole" VARCHAR(30),
    "numLanes" INTEGER NOT NULL,

    CONSTRAINT "RaceMetadata_pkey" PRIMARY KEY ("id")
);

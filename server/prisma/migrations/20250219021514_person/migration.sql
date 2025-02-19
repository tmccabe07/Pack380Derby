-- CreateTable
CREATE TABLE "Person" (
    "person_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "den" VARCHAR(30),
    "rank" VARCHAR(30),
    "role" VARCHAR(30),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("person_id")
);

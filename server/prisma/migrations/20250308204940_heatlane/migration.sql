-- CreateTable
CREATE TABLE "HeatLane" (
    "id" SERIAL NOT NULL,
    "lane" INTEGER NOT NULL,
    "result" INTEGER,
    "carId" INTEGER,

    CONSTRAINT "HeatLane_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeatLane_carId_key" ON "HeatLane"("carId");

-- AddForeignKey
ALTER TABLE "HeatLane" ADD CONSTRAINT "HeatLane_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_racerId_fkey";

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "racerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_racerId_fkey" FOREIGN KEY ("racerId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

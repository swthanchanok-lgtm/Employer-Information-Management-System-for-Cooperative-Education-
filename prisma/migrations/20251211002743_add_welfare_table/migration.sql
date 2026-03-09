-- CreateEnum
CREATE TYPE "InternshipStatus" AS ENUM ('TRAINING', 'COMPLETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "internshipStatus" "InternshipStatus" NOT NULL DEFAULT 'TRAINING';

-- CreateTable
CREATE TABLE "Welfare" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "establishmentId" INTEGER NOT NULL,

    CONSTRAINT "Welfare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Welfare" ADD CONSTRAINT "Welfare_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

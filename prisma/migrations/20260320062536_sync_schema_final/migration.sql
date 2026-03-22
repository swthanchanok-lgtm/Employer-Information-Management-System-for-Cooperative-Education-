/*
  Warnings:

  - The `internshipStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InternshipStatus" ADD VALUE 'NOT_STARTED';
ALTER TYPE "InternshipStatus" ADD VALUE 'READY';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEvaluated" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "internshipStatus",
ADD COLUMN     "internshipStatus" TEXT DEFAULT 'NOT_STARTED';

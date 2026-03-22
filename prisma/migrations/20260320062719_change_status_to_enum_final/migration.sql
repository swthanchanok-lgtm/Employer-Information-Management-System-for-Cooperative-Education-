/*
  Warnings:

  - The `internshipStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "internshipStatus",
ADD COLUMN     "internshipStatus" "InternshipStatus" NOT NULL DEFAULT 'NOT_STARTED';

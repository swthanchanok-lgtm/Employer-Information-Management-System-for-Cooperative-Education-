/*
  Warnings:

  - You are about to drop the column `Tel` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Tel",
ADD COLUMN     "academicRank" TEXT,
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "personnelType" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "prefix" TEXT,
ADD COLUMN     "surname" TEXT,
ADD COLUMN     "tel" TEXT;

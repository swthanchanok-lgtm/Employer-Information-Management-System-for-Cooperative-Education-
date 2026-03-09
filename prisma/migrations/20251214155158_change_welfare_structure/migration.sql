/*
  Warnings:

  - You are about to drop the column `description` on the `Welfare` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Welfare" DROP COLUMN "description",
ADD COLUMN     "accommodation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transportation" BOOLEAN NOT NULL DEFAULT false;

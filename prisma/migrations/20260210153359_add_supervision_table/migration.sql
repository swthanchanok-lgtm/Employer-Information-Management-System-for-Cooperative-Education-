/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvaluationRound" AS ENUM ('ROUND_1', 'ROUND_2', 'ROUND_3');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Tel" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "evaluations" ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "evaluation_round" "EvaluationRound" NOT NULL DEFAULT 'ROUND_1',
ADD COLUMN     "evaluator_name" TEXT,
ADD COLUMN     "signature_url" TEXT,
ALTER COLUMN "evaluator_id" DROP NOT NULL,
ALTER COLUMN "student_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

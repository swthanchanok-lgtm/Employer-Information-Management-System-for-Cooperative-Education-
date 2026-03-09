/*
  Warnings:

  - You are about to drop the `Welfare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Welfare" DROP CONSTRAINT "Welfare_establishmentId_fkey";

-- DropTable
DROP TABLE "Welfare";

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT,
    "salary" INTEGER NOT NULL DEFAULT 0,
    "hasShuttle" BOOLEAN NOT NULL DEFAULT false,
    "hasDorm" BOOLEAN NOT NULL DEFAULT false,
    "establishmentId" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `tel` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tel";

-- CreateTable
CREATE TABLE "SupervisionGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "SupervisionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstructorInGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SupervisionGroup_studentId_key" ON "SupervisionGroup"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_InstructorInGroup_AB_unique" ON "_InstructorInGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_InstructorInGroup_B_index" ON "_InstructorInGroup"("B");

-- AddForeignKey
ALTER TABLE "SupervisionGroup" ADD CONSTRAINT "SupervisionGroup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorInGroup" ADD CONSTRAINT "_InstructorInGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "SupervisionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorInGroup" ADD CONSTRAINT "_InstructorInGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

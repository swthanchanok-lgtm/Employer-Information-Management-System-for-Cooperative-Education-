-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "academicYearId" INTEGER;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

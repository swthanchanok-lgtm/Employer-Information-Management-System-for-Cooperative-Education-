-- AlterTable
ALTER TABLE "supervisions" ADD COLUMN     "mentorSignature" TEXT,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "teacherSignature" TEXT;

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "studentId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "establishmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

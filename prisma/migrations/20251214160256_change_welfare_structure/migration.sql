-- DropForeignKey
ALTER TABLE "Welfare" DROP CONSTRAINT "Welfare_establishmentId_fkey";

-- AddForeignKey
ALTER TABLE "Welfare" ADD CONSTRAINT "Welfare_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

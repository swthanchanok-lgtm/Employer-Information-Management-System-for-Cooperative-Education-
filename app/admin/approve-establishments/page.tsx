import { PrismaClient } from '@prisma/client';
import ApproveClient from './ApproveClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function ApproveEstablishmentsPage() {
  const session = await getServerSession(authOptions);

  // ป้องกันคนที่ไม่ใช่ ADMIN หรือ COURSE_INSTRUCTOR เข้ามาหน้านี้
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "COURSE_INSTRUCTOR")) {
    redirect("/dashboard");
  }

  // ดึงเฉพาะบริษัทที่รออนุมัติ (PENDING)
  const pendingEstablishments = await prisma.establishment.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  });

  return <ApproveClient initialData={pendingEstablishments} />;
}
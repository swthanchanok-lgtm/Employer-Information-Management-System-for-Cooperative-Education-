import { PrismaClient } from '@prisma/client';
import ApproveClient from './ApproveClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function ApproveEstablishmentsPage() {
  const session = await getServerSession(authOptions);

  // ป้องกันคนที่ไม่ใช่ ADMIN หรือ COURSE_INSTRUCTOR เข้ามาหน้านี้
 if (!session || (session.user.role !== "COURSE_INSTRUCTOR" && session.user.role !== "ADMIN")) {
  redirect("/dashboard"); // ถ้าไม่ใช่คนที่มีสิทธิ์ ให้เด้งกลับหน้าหลักตัวเอง
}

  const pendingEstablishments = await prisma.establishment.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  });

  return <ApproveClient initialData={pendingEstablishments} userRole={session.user.role} />;
}
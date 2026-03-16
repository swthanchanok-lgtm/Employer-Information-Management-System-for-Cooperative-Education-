// 📄 ไฟล์: app/supervisor/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client';
import SupervisionClient from "@/app/components/SupervisionClient"; 

const prisma = new PrismaClient();

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  // 1. เช็คว่าล็อกอินไหม
  if (!session || !session.user) {
    redirect("/login");
  }

  const teacherId = Number(session.user.id);

  // 2. ดึงข้อมูลนักศึกษาจาก Database โดยตรงเลยแม่! (จบปัญหา 401)
  const supervisionGroups = await prisma.supervisionGroup.findMany({
    where: {
      instructors: {
        some: { id: teacherId } 
      }
    },
    include: {
      student: { 
        include: {
          establishment: true,
          supervisionsReceived: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  // 3. ปรับ Format ข้อมูลให้น้อง SupervisionClient (ไฟล์ลูก) เอาไปใช้ง่ายๆ
  const formattedStudents = supervisionGroups
    .map((group) => group.student)
    .filter((std) => std !== null)
    .map((std: any) => ({
      ...std,
      isSupervised: std.supervisionsReceived && std.supervisionsReceived.length > 0,
    }));

  return (
    <div className="p-8">
       {/* 🚩 ส่งข้อมูลที่ดึงได้สดๆ ให้ไฟล์ลูกเลยจ้า */}
       <SupervisionClient 
          initialStudents={formattedStudents} 
          isSupervisorView={true} 
       />
    </div>
  );
}
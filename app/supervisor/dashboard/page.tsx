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

  // 2. ดึงข้อมูลนักศึกษาจาก Database โดยตรง
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

  const allStudents = supervisionGroups
    .map((group) => group.student)
    .filter((std) => std !== null);

  // 🚩 3. คำนวณสถิติเพื่อส่งให้การ์ด 4 ใบในหน้า Dashboard
  const stats = {
    total: allStudents.length,
    supervised: allStudents.filter(s => s.supervisionsReceived && s.supervisionsReceived.length > 0).length,
    pending: allStudents.filter(s => !s.supervisionsReceived || s.supervisionsReceived.length === 0).length,
    establishmentCount: new Set(allStudents.map(s => s.establishmentId).filter(id => id)).size
  };

  // 🚩 4. ปรับ Format ข้อมูล ดักจับ undefined ให้ชัวร์ 100%
  const formattedStudents = allStudents.map((std: any) => ({
    ...std, // เก็บของเดิมไว้ด้วยเผื่อต้องใช้
    id: std.id,
    firstName: std.name || std.firstName || "ไม่มีชื่อ", 
    lastName: std.surname || std.lastName || "",
    major: std.department || std.major || "ทั่วไป",
    establishmentName: std.establishment?.name || "ยังไม่ระบุ",
    isSupervised: std.supervisionsReceived && std.supervisionsReceived.length > 0,
    lastSupervisionDate: std.supervisionsReceived?.[0]?.createdAt || null,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
       {/* 🚩 ส่งข้อมูลนักศึกษาและสถิติให้ไฟล์ลูกเลยจ้า */}
       <SupervisionClient 
         initialStudents={formattedStudents} 
         stats={stats}
         isSupervisorView={true} 
       />
    </div>
  );
}
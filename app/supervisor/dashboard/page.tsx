import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client';
import SupervisionClient from "@/app/components/SupervisionClient"; 

const prisma = new PrismaClient();

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const teacherId = Number(session.user.id);

  // 1. ดึงข้อมูลนักศึกษาทุกคนในกลุ่มที่อาจารย์ดูแล (ไม่ใช้ .filter ออก)
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
          // ดึงประวัติการนิเทศทั้งหมดมาเพื่อนับจำนวนครั้ง
          supervisionsReceived: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  const allStudents = supervisionGroups
    .map((group) => group.student)
    .filter((std) => std !== null);

  // 2. คำนวณสถิติส่งให้การ์ด 4 ใบ (ใช้ข้อมูลจริงจาก Database)
  const stats = {
    total: allStudents.length,
    supervised: allStudents.filter(s => s.supervisionsReceived && s.supervisionsReceived.length > 0).length,
    pending: allStudents.filter(s => !s.supervisionsReceived || s.supervisionsReceived.length === 0).length,
    establishmentCount: new Set(allStudents.map(s => s.establishmentId).filter(id => id)).size
  };

  // 3. ปรับ Format ข้อมูลให้น้อง SupervisionClient เอาไปโชว์ "ครั้งที่นิเทศ" ได้
  const formattedStudents = allStudents.map((std: any) => ({
    ...std,
    id: std.id,
    firstName: std.name || "ไม่มีชื่อ", 
    lastName: std.surname || "",
    establishmentName: std.establishment?.name || "ยังไม่ระบุ",
    // เช็คว่าเคยนิเทศหรือยัง
    isSupervised: std.supervisionsReceived && std.supervisionsReceived.length > 0,
    // ส่งจำนวนครั้งที่นิเทศไปแสดงผล
    visitCount: std.supervisionsReceived?.length || 0,
    // วันที่นิเทศล่าสุด
    lastSupervisionDate: std.supervisionsReceived?.[0]?.createdAt || null,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
       <SupervisionClient 
          initialStudents={formattedStudents} 
          stats={stats}
          isSupervisorView={true} 
       />
    </div>
  );
}
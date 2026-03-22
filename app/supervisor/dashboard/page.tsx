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

  // 1. ดึงข้อมูลนักศึกษาทุกคนในกลุ่มที่อาจารย์ดูแล
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
          // ดึงข้อมูลจากตาราง evaluations
          evaluations: {
            orderBy: { evaluatedAt: 'desc' } 
          }
        }
      }
    }
  });

  const allStudents = supervisionGroups
    .map((group) => group.student)
    .filter((std) => std !== null);

  // 2. คำนวณสถิติส่งให้การ์ด
  const stats = {
    total: allStudents.length,
    supervised: allStudents.filter(s => s.evaluations && s.evaluations.length > 0).length,
    pending: allStudents.filter(s => !s.evaluations || s.evaluations.length === 0).length,
    establishmentCount: new Set(allStudents.map(s => s.establishmentId).filter(id => id)).size
  };

  // 3. ปรับ Format ข้อมูลส่งให้ SupervisionClient
  const formattedStudents = allStudents.map((std: any) => {
    // 🚩 เพิ่มฟังก์ชันนับจำนวนครั้งที่นิเทศ โดยนับจากคอลัมน์ "round" ใน Database 
    // ใช้ Set เพื่อกรองค่าที่ซ้ำกัน (เช่น ฟอร์ม 1 และ 2 จะเป็น ROUND_1 เหมือนกัน ก็นับเป็น 1 ครั้ง)
    const uniqueRounds = std.evaluations 
      ? new Set(std.evaluations.map((e: any) => e.round).filter(Boolean)).size 
      : 0;

    return {
      ...std,
      id: std.id,
      firstName: std.name || "ไม่มีชื่อ", 
      lastName: std.surname || "",
      establishmentName: std.establishment?.name || "ยังไม่ระบุ",
      
      // เช็คว่าเคยนิเทศ/ประเมินหรือยัง จากตาราง evaluations
      isSupervised: std.evaluations && std.evaluations.length > 0,
      
      // 🚩 เพิ่มตัวแปร visitCount ตรงนี้จ้ะ เพื่อส่งไปโชว์ว่านิเทศครั้งที่เท่าไหร่
      visitCount: uniqueRounds,
      
      // วันที่ประเมินล่าสุด
      lastSupervisionDate: std.evaluations?.[0]?.evaluatedAt || null,
    };
  });

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
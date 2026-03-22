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

  // 1. ดึงข้อมูลนักศึกษาในกลุ่มที่อาจารย์คนนี้ดูแล
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
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  // 2. ปรับ Format เฉพาะส่วนที่จำเป็นต้องใช้ในตารางรายชื่อ
  const formattedStudents = supervisionGroups
    .map((group) => group.student)
    .filter((std) => std !== null)
    .map((std: any) => ({
      ...std,
      firstName: std.name || "ไม่มีชื่อ", 
      lastName: std.surname || "",
      establishmentName: std.establishment?.name || "ยังไม่ระบุ",
      visitCount: std.supervisionsReceived?.length || 0,
      isSupervised: std.supervisionsReceived && std.supervisionsReceived.length > 0,
      lastSupervisionDate: std.supervisionsReceived?.[0]?.createdAt || null
    }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* 🚩 ส่งไปแค่รายชื่อ ไม่ต้องส่ง stats แล้วจ้า */}
      <SupervisionClient
        initialStudents={formattedStudents}
        isSupervisorView={true}
        showStats={false}
      />
    </div>
  );
}
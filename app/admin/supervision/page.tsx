// app/admin/supervision/page.tsx
import { prisma } from "@/lib/prisma";
import AdminSupervisionClient from "./SupervisionClient";

export default async function AdminSupervisionPage() {
  // ดึงเด็กทุกคน + ข้อมูลที่เกี่ยวข้องมาโชว์ในตาราง
  const students = await prisma.user.findMany({
    where: { 
      role: { name: "STUDENT" } 
    },
    include: {
      establishment: true, // 🏢 โชว์สถานประกอบการ
      // 📅 เอาวันที่นิเทศล่าสุด (แยกจากกลุ่มนิเทศนะจ๊ะ)
      evaluations: {
        orderBy: { evaluatedAt: 'desc' },
        take: 1 
      },
      // 👥 ดูว่ากลุ่มนี้มีอาจารย์คนไหนบ้าง (ไว้ติ๊กเลือกอาจารย์)
      supervisionGroup: {
        include: {
          instructors: true 
        }
      }
    },
    orderBy: { 
      username: 'asc' 
    }
  });

  const supervisors = await prisma.user.findMany({
    where: { role: { name: "SUPERVISOR" } }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">จัดทีมอาจารย์นิเทศ (กลุ่ม)</h1>
      <AdminSupervisionClient 
        initialStudents={JSON.parse(JSON.stringify(students))} 
        supervisors={supervisors} 
      />
    </div>
  );
}
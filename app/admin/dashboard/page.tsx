// 📂 app/admin/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 📊 ดึงข้อมูลแบบครอบจักรวาล: นักศึกษา, อาจารย์, บริษัท, และตำแหน่งงาน
  const [
    totalStudents,
    totalSupervisors,
    totalEstablishments,
    totalPendingJobs, // 🚩 1. นับจำนวนงานที่รออนุมัติ
    pendingRequests,  // รายการบริษัทรออนุมัติ
    pendingJobs,      // 🚩 2. ดึงรายชื่อตำแหน่งงานที่รออนุมัติ
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "SUPERVISOR" } }),
    prisma.establishment.count({ where: { status: "APPROVED" } }),
    
    // 🚩 นับจำนวนงานที่ status เป็น PENDING
    prisma.job.count({ where: { status: "PENDING" } }), 

    // 🏢 ดึงรายการบริษัทที่รออนุมัติ (Pending)
    prisma.establishment.findMany({
      where: { status: "PENDING" }, 
      orderBy: { createdAt: 'desc' }
    }),

    // 🚩 ดึงรายการตำแหน่งงานที่รออนุมัติ พร้อมชื่อบริษัท
    prisma.job.findMany({
      where: { status: "PENDING" },
      include: {
        establishment: true // จอยตารางบริษัทมาเอาชื่อมาโชว์ด้วย
      },
      orderBy: { id: 'desc' }
    }),
  ]);

  // จัดกลุ่มสถิติเพื่อส่งไปให้ Component ลูก
  const stats = {
    totalStudents,
    totalSupervisors,
    totalEstablishments,
    totalPendingJobs, // 🚩 ส่งค่านี้ไปด้วย ตัวแดงที่ Stats จะหายไป
  };

  return (
    <AdminDashboardClient 
      session={session} 
      stats={stats} 
      pendingRequests={pendingRequests} 
      pendingJobs={pendingJobs} // 🚩 ส่งรายชื่อตำแหน่งงานไปโชว์ใน Section ใหม่
    />
  );
}
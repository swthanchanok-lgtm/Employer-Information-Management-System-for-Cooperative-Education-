// 📂 app/admin/dashboard/page.tsx
import { getServerSession,NextAuthOptions, DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import AdminDashboardClient from "./AdminDashboardClient";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

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
    totalPendingJobs, 
    pendingRequests,  
    pendingJobs,      
  ] = await Promise.all([
    // ✅ แก้ไขตรงนี้: มุดเข้าไปหาชื่อในตาราง role
    prisma.user.count({ 
      where: { 
        role: { 
          name: "STUDENT" 
        } 
      } 
    }),

    // ✅ แก้ไขตรงนี้เช่นกัน:
    prisma.user.count({ 
      where: { 
        role: { 
          name: "SUPERVISOR" 
        } 
      } 
    }),

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
        establishment: true 
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
import { PrismaClient } from '@prisma/client';
import { DashboardClient } from './DashboardClient'; // สำหรับนักศึกษา
import TeacherDashboard from '../components/TeacherDashboard'; // สำหรับอาจารย์
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // 1. ตรวจสอบความปลอดภัย: ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้า Login
  if (!session) {
    redirect("/login");
  }

  const userRole = session.user?.role;
  // แปลง ID ของผู้ใช้ปัจจุบันเป็นตัวเลข เพื่อใช้เปรียบเทียบกับ supervisorId ในฐานข้อมูล
  const currentUserId = Number(session.user?.id);

  // -----------------------------------------------------------------
  // 🟢 CASE 1: ถ้าเป็น ADMIN (แยกไปหน้า Admin โดยเฉพาะ)
  // -----------------------------------------------------------------
  if (userRole === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // -----------------------------------------------------------------
  // 🟡 CASE 2: ถ้าเป็นอาจารย์ (SUPERVISOR หรือ COURSE_INSTRUCTOR)
  // -----------------------------------------------------------------
  if (userRole === "SUPERVISOR" || userRole === "COURSE_INSTRUCTOR") {
    
    // ดึงคำร้องขอฝึกงานที่สถานะเป็น PENDING (สำหรับอาจารย์ประจำวิชา)
    const rawPendingStudents = await prisma.user.findMany({
      where: { 
        role: "STUDENT",
        approvalStatus: "PENDING", 
        establishmentId: { not: null } 
      },
      include: {
        establishment: true 
      },
      orderBy: { id: 'desc' }
    });

    // จัดรูปข้อมูลให้ตรงกับที่ Component TeacherDashboard รอรับ
    const pendingRequests = rawPendingStudents.map((student) => ({
      id: student.id,
      studentName: student.name,
      studentUsername: student.username,
      establishmentName: student.establishment?.name || 'ไม่ทราบชื่อสถานประกอบการ',
      createdAt: '-', // ในตาราง User ไม่มีเก็บวันที่ยื่นเรื่อง จึงใส่เป็นขีดไว้
    }));

    // 🚩 [จุดสำคัญ] ดึงข้อมูลนักศึกษาในความดูแล (อาจารย์นิเทศ)
    const myStudents = await prisma.user.findMany({
      where: { 
        role: "STUDENT",
        // เงื่อนไข: ต้องมี ID ของเราอยู่ในช่อง supervisorId เท่านั้น
        supervisorId: currentUserId, 
        // เงื่อนไขเสริม: โชว์เฉพาะเด็กที่ได้รับอนุมัติสถานที่ฝึกงานเรียบร้อยแล้ว (APPROVED)
        approvalStatus: "APPROVED"
      },
      include: {
        establishment: true 
      }
    });

    return (
      <TeacherDashboard 
        currentUser={session.user} 
        pendingRequests={pendingRequests} 
        myStudents={myStudents}
      />
    );
  }

  // -----------------------------------------------------------------
  // 🔵 CASE 3: ถ้าเป็นนักศึกษา (STUDENT)
  // -----------------------------------------------------------------
  const establishments = await prisma.establishment.findMany({
    where: { status: "APPROVED" },
    orderBy: { id: 'desc' }
  });

  return (
    <DashboardClient 
      initialEstablishments={establishments} 
      currentUser={session.user} 
    />
  );
}
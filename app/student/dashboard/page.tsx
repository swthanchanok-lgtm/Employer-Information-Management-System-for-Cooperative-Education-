import { PrismaClient } from '@prisma/client';
import { DashboardClient } from './DashboardClient'; // สำหรับนักศึกษา
import TeacherDashboard from "@/app/teachers/instructor/dashboard/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        role: {
          name: "STUDENT" // ✅ เจาะเข้าไปดึงฟิลด์ name ในตาราง Role แทน
        },
        approvalStatus: "PENDING",
        establishmentId: {
          not: null
        }
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

    const myStudents = await prisma.user.findMany({
  where: {
    role: {
      name: "STUDENT"
    },
    supervisorId: currentUserId, // 👈 แอดมินจับคู่ผ่านฟิลด์นี้
    // ❌ ของเดิม: approvalStatus: "APPROVED" 
    // ✅ ของใหม่: ให้ดึงมาหมดเลย ไม่ว่าสถานะจะเป็นอะไร ขอแค่แอดมินจับคู่ supervisorId มาให้ก็พอ
    approvalStatus: {
      in: ["APPROVED", "PENDING", "NOT_SUBMITTED"] 
    }
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
  // 1. ดึงข้อมูล User จาก Database ให้ชัวร์ก่อน
  const dbUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  if (!dbUser) {
    return <div>ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่จ้า</div>;
  }

  // 2. ดึงใบคำร้อง "ล่าสุด" ของเด็กคนนี้ (ดึงแค่ตัวนี้ตัวเดียวพอเลย)
  const latestApplication = await prisma.application.findFirst({
    where: { studentId: dbUser.id }, // ใช้ id จาก dbUser
    orderBy: { createdAt: 'desc' },
    include: {
      job: true,
      establishment: true
    }
  });

  // 3. จัดการเรื่องสถานะให้เด็ดขาด!
  let currentStatus = "NOT_SUBMITTED";
  if (latestApplication) {
  // 🚩 ถ้าเด็กคนนี้เคย "กดยื่น" แล้ว (มีข้อมูลในตาราง Application) 
  // ให้ยึด Status จากใบคำร้องล่าสุดเสมอ ไม่ว่าจะเป็น PENDING, APPROVED หรือ REJECTED
  currentStatus = latestApplication.status; 
} else if (dbUser.approvalStatus && dbUser.approvalStatus !== "NOT_SUBMITTED") {
  // ถ้าไม่มีใบคำร้อง แต่ในตัว User เคยมีสถานะอื่นติดอยู่ (กรณีข้อมูลเก่า) ให้ใช้ตามนั้น
  currentStatus = dbUser.approvalStatus;
}

// 4. แพ็คของส่งให้ Client
const currentUserForClient = {
  ...session?.user,
  id: dbUser.id,
  name: dbUser.name,
  // 🚩 ส่งสถานะที่คำนวณแล้วไปให้ DashboardClient
  approvalStatus: currentStatus, 
};

  // 5. ดึงข้อมูลอื่นๆ ตามปกติ
  const establishments = await prisma.establishment.findMany({
    where: { status: "APPROVED" },
    orderBy: { id: 'desc' }
  });

  const jobs = await prisma.job.findMany({
    include: { establishment: true }
  });

  return (
    <DashboardClient
      initialEstablishments={establishments}
      initialJobs={jobs}
      currentUser={currentUserForClient} 
      application={latestApplication}
    />
  );
}
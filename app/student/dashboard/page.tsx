import { DashboardClient } from './DashboardClient';
import { getSession } from '@/lib/session'; // 🚩 1. เปลี่ยนมาใช้ระบบใหม่ของเรา
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // 🚩 2. ดึง Session จากระบบ KSU LDAP ที่เราทำ
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // 🚩 3. เช็ค Role ถ้าไม่ใช่ STUDENT ให้ไล่ไปหน้าอื่น! 
  // (ป้องกันเอาหน้าอาจารย์มาโชว์ให้เด็ก)
  if (session.role !== "STUDENT") {
    if (session.role === "ADMIN") redirect("/admin/dashboard");
    if (session.role === "INSTRUCTOR" || session.role === "SUPERVISOR") {
      redirect("/teachers/instructor/dashboard");
    }
    // ถ้าไม่มี Role ที่รู้จัก ให้เด้งออก
    redirect("/login");
  }

  // 🚩 4. ดึงข้อมูลเฉพาะของแม่ (ธัญชนก) โดยใช้ ID จาก Session จริง
  const dbUser = await prisma.user.findUnique({
    where: { id: Number(session.id) }, // ใช้ ID จากคนที่ล็อกอินจริงๆ
    include: { role: true }
  });

  if (!dbUser) {
    return <div>ไม่พบข้อมูลผู้ใช้ในระบบจ้าแม่ กรุณาติดต่อแอดมินนะจ๊ะ</div>;
  }

  // 5. ดึงใบคำร้อง "ล่าสุด" ของแม่
  const latestApplication = await prisma.application.findFirst({
    where: { studentId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    include: { job: true, establishment: true }
  });

  // 6. ดึงข้อมูลสถานประกอบการ (เอาไว้ให้เลือก)
  const [establishments, jobs] = await Promise.all([
    prisma.establishment.findMany({ where: { status: "APPROVED" }, orderBy: { id: 'desc' } }),
    prisma.job.findMany({ include: { establishment: true } })
  ]);

  // 7. แพ็คของส่งให้ DashboardClient (UI ฝั่งนักศึกษา)
  return (
    <DashboardClient
      initialEstablishments={establishments}
      initialJobs={jobs}
      currentUser={{
        ...session,
        id: dbUser.id,
        approvalStatus: latestApplication?.status || dbUser.approvalStatus || "NOT_SUBMITTED"
      }} 
      application={latestApplication}
    />
  );
}
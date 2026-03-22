import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"; // 🚩 อย่าลืมดึง Session จริงๆ นะแม่
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 💡 1. ดึง ID นักศึกษาจาก Session จริง (เพื่อความปลอดภัย)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาล็อกอินก่อนจ้า" }, { status: 401 });
    }
    const currentStudentId = Number(session.user.id); 

    // 2. ดึงข้อมูลนักศึกษา พร้อมข้อมูลปีการศึกษาที่เขาสังกัดอยู่
    const student = await prisma.user.findUnique({
      where: { id: currentStudentId },
      include: {
        academicYear: true, // 🚩 ดึงข้อมูลปีมาด้วยเพื่อเอาไปกรองคำร้อง
        establishment: true 
      }
    });

    if (!student) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนักศึกษา" }, { status: 404 });
    }

    // 3. ดึงใบคำร้อง "ล่าสุด" เฉพาะของ "ปีการศึกษาปัจจุบัน" ของเด็กคนนี้
    const latestApplication = await prisma.application.findFirst({
      where: { 
        studentId: currentStudentId,
        // 🚩 กรองเฉพาะปีที่เด็กคนนี้สังกัดอยู่ (ซึ่งเราเพิ่ง Migrate ฟิลด์นี้ไป!)
        academicYearId: student.academicYearId 
      },
      orderBy: { createdAt: 'desc' }, 
      include: {
        job: true,
        establishment: true,
        academicYear: true
      }
    });

    // 4. [แถมให้แม่] สรุปสถานะส่งกลับไปให้หน้าบ้านใช้ง่ายๆ
    const dashboardData = {
      studentInfo: {
        name: `${student.name} ${student.surname || ''}`,
        studentCode: student.username,
        major: student.department,
        currentYear: student.academicYear?.year,
        currentSemester: student.academicYear?.semester,
      },
      applicationStatus: latestApplication ? {
        status: latestApplication.status, // PENDING, APPROVED, REJECTED
        companyName: latestApplication.establishment?.name,
        jobTitle: latestApplication.job?.title,
        appliedDate: latestApplication.createdAt,
      } : null,
      isInternshipSet: !!student.establishmentId // เช็คว่ามีที่ฝึกงานทางการหรือยัง
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Student Dashboard API Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูล Dashboard ไม่สำเร็จจ้า" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 💡 สมมติว่าดึง ID นักศึกษาที่ล็อกอินอยู่ (แม่ต้องเปลี่ยนเป็นดึงจาก Session จริงๆ นะจ๊ะ)
    const currentStudentId = 1; 

    // 1. ดึงข้อมูลนักศึกษา
    const student = await prisma.user.findUnique({
      where: { id: currentStudentId },
      include: {
        establishment: true // ดึงบริษัทที่ผูกไว้ (ถ้าอาจารย์อนุมัติแล้ว)
      }
    });

    if (!student) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนักศึกษา" }, { status: 404 });
    }

    // 2. ดึงใบคำร้อง "ล่าสุด" ของเด็กคนนี้ เพื่อเอามาโชว์ว่ากำลังรอที่ไหน หรือโดนปฏิเสธจากที่ไหน
    const latestApplication = await prisma.application.findFirst({
      where: { studentId: currentStudentId },
      orderBy: { createdAt: 'desc' }, // เอาอันใหม่สุดขึ้นก่อน
      include: {
        job: true,
        establishment: true
      }
    });

    return NextResponse.json({ 
      student, 
      application: latestApplication 
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
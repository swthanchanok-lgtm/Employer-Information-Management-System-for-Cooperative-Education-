import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 🔍 ดึงคำร้องที่เป็น PENDING ของ "ปีการศึกษาปัจจุบัน"
    const applications = await prisma.application.findMany({
      where: { 
        status: 'PENDING',
        // 🚩 [ปรับใหม่] กรองจาก academicYearId ในใบคำร้องได้เลย
        // โดยเช็คว่าปีนั้นต้องเป็น isCurrent: true
        academicYear: {
          isCurrent: true
        }
      },
      include: {
        student: {
          include: {
            academicYear: true 
          }
        },
        job: true,
        establishment: true,
        academicYear: true, // 👈 ดึงข้อมูลปีการศึกษาของใบคำร้องมาโชว์ด้วยก็ได้จ้ะ
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: applications });
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
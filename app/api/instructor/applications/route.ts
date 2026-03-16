import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงคำร้องทั้งหมดที่สถานะเป็น PENDING พร้อมข้อมูลเด็ก, งาน, และบริษัท
    const applications = await prisma.application.findMany({
      where: { status: 'PENDING' },
      include: {
        student: true,
        job: true,
        establishment: true,
      },
      orderBy: { createdAt: 'desc' } // เรียงอันใหม่ล่าสุดขึ้นก่อน
    });

    return NextResponse.json({ data: applications });
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
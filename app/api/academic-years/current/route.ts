import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. พยายามหาปีการศึกษาที่ตั้งเป็นปัจจุบันไว้ (isCurrent: true)
    let currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });

    // 2. 🚩 [กันเหนียว] ถ้าไม่มีใครโดนติ๊ก true เลย ให้หาปีล่าสุด + เทอมล่าสุดมาแทน
    if (!currentYear) {
      currentYear = await prisma.academicYear.findFirst({
        orderBy: [
          { year: 'desc' },
          { semester: 'desc' },
        ],
      });
    }

    // 3. ถ้าในฐานข้อมูลว่างเปล่าจริงๆ (ไม่มีข้อมูลเลยสักแถว)
    if (!currentYear) {
      return NextResponse.json({ error: "ยังไม่มีข้อมูลปีการศึกษาในระบบ" }, { status: 404 });
    }

    return NextResponse.json(currentYear);
  } catch (error) {
    console.error("Fetch Current Academic Year Error:", error);
    return NextResponse.json(
      { error: "ดึงข้อมูลปีการศึกษาไม่ได้จ้าแม่" }, 
      { status: 500 }
    );
  }
}
// 📍 ไฟล์: app/api/academic-years/current/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true }, // 🚩 ดึงตัวที่แม่ติ๊กไว้ว่าเป็นปัจจุบัน
      orderBy: { id: 'desc' }      // กันเหนียว ถ้าลืมติ๊ก ให้ดึงตัวล่าสุดมาแทน
    });

    return NextResponse.json(currentYear);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่ได้จ้า" }, { status: 500 });
  }
}
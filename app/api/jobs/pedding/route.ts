import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingJobs = await prisma.job.findMany({
      where: { 
        status: "APPROVED" // ✅ ดึงเฉพาะงานที่ยังไม่อนุมัติ
      }, 
      include: {
        establishment: true // ✅ ดึงข้อมูลบริษัทมาโชว์คู่กันด้วย
      }
      // ✂️ ลบ orderBy: { createdAt: 'desc' } ออกไปแล้วจ้า!
    });

    return NextResponse.json(pendingJobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ดึงข้อมูลงานค้างไม่ออกจ้า" }, { status: 500 });
  }
}
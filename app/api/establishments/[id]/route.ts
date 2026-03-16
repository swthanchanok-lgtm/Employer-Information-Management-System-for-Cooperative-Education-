import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // 👈 แนะนำให้ใช้ prisma จาก lib กลางเพื่อประสิทธิภาพจ้า

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 1. เปลี่ยนเป็น Promise ตามกฎ Next 15
) {
  try {
    // 👈 2. ต้องทำการ await params ก่อนเอา id มาใช้
    const { id } = await params; 
    const establishmentId = Number(id);

    const establishment = await prisma.establishment.findUnique({
      where: { id: establishmentId },
      include: {
        reviews: true, 
        jobs: {
          where: { status: "APPROVED" } // 👈 3. ดึงตำแหน่งงานที่อนุมัติแล้วของบริษัทนี้มาโชว์ด้วย!
        },
      },
    });

    if (!establishment) {
      return NextResponse.json({ error: 'ไม่พบสถานประกอบการ' }, { status: 404 });
    }

    return NextResponse.json(establishment);
  } catch (error) {
    console.error('Error fetching establishment details:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}
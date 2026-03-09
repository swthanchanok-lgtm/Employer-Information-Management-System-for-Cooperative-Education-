import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ ฟังก์ชัน GET: สำหรับดึงข้อมูลสถานประกอบการ "แค่ 1 แห่ง" พร้อมรีวิว
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const establishmentId = Number(params.id);

    const establishment = await prisma.establishment.findUnique({
      where: { id: establishmentId },
      include: {
        reviews: true, // 👈 ดึงรีวิวทั้งหมดที่พ่วงอยู่กับบริษัทนี้มาด้วย!
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
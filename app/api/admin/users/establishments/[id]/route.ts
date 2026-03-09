import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🚩 สังเกตตรงนี้: เราเปลี่ยนไทป์ให้ params เป็น Promise ตามกฎใหม่
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. แกะกล่อง params ด้วยคำว่า await 🚨 (ตรงนี้แหละพระเอกของเรา!)
    const params = await context.params;
    
    // 2. ดึง ID มาแปลงเป็นตัวเลข
    const targetId = parseInt(params.id, 10);

    // กันเหนียว: เช็คว่าได้ ID มาเป็นตัวเลขจริงๆ ไหม
    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    // 3. ดึงข้อมูล status ที่หน้าบ้านส่งมา (APPROVED / REJECTED)
    const body = await request.json();
    const { status } = body; 

    if (!status) {
      return NextResponse.json({ error: "ไม่พบสถานะที่ต้องการอัปเดต" }, { status: 400 });
    }

    // 4. สั่ง Prisma อัปเดตข้อมูล
    const updatedEstablishment = await prisma.establishment.update({
      where: { id: targetId },
      data: { status: status },
    });

    return NextResponse.json({ message: "อัปเดตสำเร็จ", data: updatedEstablishment });
    
  } catch (error) {
    console.error("Error updating establishment:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}
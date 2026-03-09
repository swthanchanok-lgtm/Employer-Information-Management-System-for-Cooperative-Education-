import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ ฟังก์ชัน PATCH สำหรับให้ Admin กดอนุมัติ (APPROVED) หรือ ปฏิเสธ (REJECTED) ตำแหน่งงาน
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. แกะกล่อง params ด้วย await (ตามกฎใหม่ของ Next.js 15)
    const params = await context.params;
    const jobId = parseInt(params.id, 10);

    if (!jobId || isNaN(jobId)) {
      return NextResponse.json({ error: "ID ของงานไม่ถูกต้อง" }, { status: 400 });
    }

    // 2. รับค่า status (เช่น APPROVED หรือ REJECTED)
    const body = await request.json();
    const { status } = body; 

    if (!status) {
      return NextResponse.json({ error: "กรุณาระบุสถานะที่ต้องการอัปเดต" }, { status: 400 });
    }

    // 3. สั่ง Prisma อัปเดตข้อมูลที่ตาราง Job (ไม่ใช่ Establishment)
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: status },
    });

    console.log(`✅ อัปเดตสถานะงาน ID ${jobId} เป็น: ${status}`);

    return NextResponse.json({ message: "อัปเดตสถานะงานสำเร็จ", data: updatedJob });
    
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json({ 
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", 
      details: error.message 
    }, { status: 500 });
  }
}
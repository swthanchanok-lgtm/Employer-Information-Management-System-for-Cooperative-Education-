import { NextResponse } from 'next/server';
import { PrismaClient, ApprovalStatus, InternshipStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const body = await request.json();
    const { action } = body; 
    
    // 🚩 2. แกะกล่อง params ด้วยคำว่า await
    const params = await context.params;
    const appId = parseInt(params.id, 10);

    // ดักไว้กันเหนียว ถ้า id ที่ส่งมาไม่ใช่ตัวเลขให้ดีดกลับไปเลย
    if (isNaN(appId)) {
      return NextResponse.json({ error: "ID คำร้องไม่ถูกต้อง" }, { status: 400 });
    }

    // 🚩 2. ตอนนี้มันรู้จัก appId แล้ว ดึงข้อมูลคำร้องได้สบายแฮ!
    const application = await prisma.application.findUnique({
      where: { id: appId }
    });

    if (!application) return NextResponse.json({ error: "ไม่พบคำร้องนี้" }, { status: 404 });

    const result = await prisma.$transaction(async (tx) => {
      if (action === 'APPROVE') {
        // ✅ ถ้าอนุมัติ: 
        // 1. เปลี่ยนสถานะใบคำร้องเป็น APPROVED
        const updatedApp = await tx.application.update({
          where: { id: appId },
          data: { status: ApprovalStatus.APPROVED }
        });

        // 2. อัปเดตข้อมูลเด็ก: ผูกบริษัท, เปลี่ยนสถานะเป็น APPROVED และกำลังฝึกงาน (TRAINING)
        await tx.user.update({
          where: { id: application.studentId },
          data: {
            approvalStatus: ApprovalStatus.APPROVED,
            establishmentId: application.establishmentId, // ผูกบริษัทเลย!
            internshipStatus: InternshipStatus.TRAINING // ขึ้นสถานะกำลังฝึกงาน
          }
        });
        return updatedApp;

      } else if (action === 'REJECT') {
        // ❌ ถ้าปฏิเสธ:
        // 1. เปลี่ยนสถานะใบคำร้องเป็น REJECTED
        const updatedApp = await tx.application.update({
          where: { id: appId },
          data: { status: ApprovalStatus.REJECTED }
        });

        // 2. อัปเดตข้อมูลเด็ก: ให้สถานะกลับไปเป็น REJECTED (เด็กจะได้ไปกดยื่นที่อื่นใหม่ได้)
        await tx.user.update({
          where: { id: application.studentId },
          data: {
            approvalStatus: ApprovalStatus.REJECTED
          }
        });
        return updatedApp;
      }
    });

    return NextResponse.json({ message: "อัปเดตสถานะสำเร็จ", data: result });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }, { status: 500 });
  }
}
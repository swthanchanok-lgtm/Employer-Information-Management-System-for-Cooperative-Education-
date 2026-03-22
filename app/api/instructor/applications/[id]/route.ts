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
    
    const params = await context.params;
    const appId = parseInt(params.id, 10);

    if (isNaN(appId)) {
      return NextResponse.json({ error: "ID คำร้องไม่ถูกต้อง" }, { status: 400 });
    }

    // 🔍 ดึงข้อมูลคำร้อง พร้อมเช็คข้อมูลปีการศึกษาของเด็กด้วย
    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: {
        student: {
          include: { academicYear: true } // ดึงข้อมูลปีการศึกษามาดูด้วย
        }
      }
    });

    if (!application) return NextResponse.json({ error: "ไม่พบคำร้องนี้" }, { status: 404 });

    // 🚩 [จุดสำคัญ] เช็คว่าเป็นการจัดการของปีการศึกษาปัจจุบันหรือไม่
    if (!application.student?.academicYear?.isCurrent) {
      return NextResponse.json({ 
        error: "ไม่สามารถจัดการคำร้องของปีการศึกษาเก่าได้ กรุณาตรวจสอบสถานะปีการศึกษา" 
      }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (action === 'APPROVE') {
        // ✅ ถ้าอนุมัติ: 
        const updatedApp = await tx.application.update({
          where: { id: appId },
          data: { status: ApprovalStatus.APPROVED }
        });

        // อัปเดตข้อมูลเด็ก: ผูกบริษัท และปีการศึกษาที่เด็กสังกัดอยู่ (TRAINING)
        await tx.user.update({
          where: { id: application.studentId },
          data: {
            approvalStatus: ApprovalStatus.APPROVED,
            establishmentId: application.establishmentId,
            internshipStatus: InternshipStatus.TRAINING
            // 💡 ตรงนี้ข้อมูลจะถูกเก็บแยกตาม academicYearId ที่ติดตัวเด็กมาตั้งแต่แรกแล้วค่ะ
          }
        });
        return updatedApp;

      } else if (action === 'REJECT') {
        // ❌ ถ้าปฏิเสธ:
        const updatedApp = await tx.application.update({
          where: { id: appId },
          data: { status: ApprovalStatus.REJECTED }
        });

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
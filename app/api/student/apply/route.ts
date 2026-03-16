import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/auth"; 

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 💡 1. ดึง Session ของคนที่กดยื่นจริงๆ
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาล็อกอินก่อนจ้า" }, { status: 401 });
    }

    // แปลง ID เป็นตัวเลข (ตาม Schema ที่ User.id เป็น Int)
    const currentStudentId = Number(session.user.id); 

    const body = await request.json();
    const { jobId, establishmentId } = body;

    // 💡 2. เช็คก่อนว่าเด็กคนนี้เคยกดยื่นไปแล้วหรือยัง? (คงเดิม)
    const existingApp = await prisma.application.findFirst({
      where: { 
        studentId: currentStudentId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (existingApp) {
      return NextResponse.json({ error: "คุณมีคำร้องที่กำลังดำเนินการอยู่แล้วจ้า" }, { status: 400 });
    }

    // 💡 3. บันทึกคำร้อง พร้อมอัปเดตสถานะที่ตัว User ด้วย (Transaction)
    // การใช้ transaction จะช่วยให้ข้อมูลในตาราง Application และ User ตรงกันเสมอจ้า
    const result = await prisma.$transaction([
      // สร้างใบคำร้อง
      prisma.application.create({
        data: {
          studentId: currentStudentId,
          jobId: jobId,
          establishmentId: establishmentId,
          status: 'PENDING'
        }
      }),
      // อัปเดตสถานะที่ตาราง User ให้เป็น PENDING ด้วย
      prisma.user.update({
        where: { id: currentStudentId },
        data: { 
          approvalStatus: 'PENDING',
          establishmentId: establishmentId 
        }
      })
    ]);

    return NextResponse.json({ 
      message: "ยื่นคำร้องสำเร็จ", 
      data: result[0] 
    });

  } catch (error: any) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดที่ระบบหลังบ้าน" }, { status: 500 });
  }
}
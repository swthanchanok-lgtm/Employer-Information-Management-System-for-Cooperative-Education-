import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาล็อกอินก่อนจ้า" }, { status: 401 });
    }

    const currentStudentId = Number(session.user.id);
    const body = await request.json();
    
    // 🚩 ปรับตรงนี้: ป้องกันถ้าหน้าบ้านส่งค่ามาไม่ครบ
    const jobId = body.jobId ? Number(body.jobId) : null;
    const establishmentId = body.establishmentId ? Number(body.establishmentId) : null;

    if (!jobId || !establishmentId) {
      return NextResponse.json({ error: "ข้อมูลงานหรือสถานประกอบการไม่ถูกต้อง" }, { status: 400 });
    }

    // 🚩 1. ไปสืบหา "ปีการศึกษา" ของเด็กคนนี้มาก่อน
    const student = await prisma.user.findUnique({
      where: { id: currentStudentId },
      select: { academicYearId: true } 
    });

    if (!student || !student.academicYearId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลปีการศึกษาของนักศึกษา กรุณาติดต่ออาจารย์จ้า" }, { status: 400 });
    }

    // 💡 2. เช็คก่อนว่าเด็กคนนี้เคยกดยื่นไปแล้วหรือยัง? (เฉพาะในปีการศึกษานี้)
    const existingApp = await prisma.application.findFirst({
      where: {
        studentId: currentStudentId,
        academicYearId: student.academicYearId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (existingApp) {
      return NextResponse.json({ error: "คุณมีคำร้องที่กำลังดำเนินการอยู่แล้วในเทอมนี้จ้า" }, { status: 400 });
    }

    // 💡 3. บันทึกคำร้อง พร้อมอัปเดตสถานะที่ตัว User
    const result = await prisma.$transaction([
      // สร้างใบคำร้อง
      prisma.application.create({
        data: {
          studentId: currentStudentId,
          jobId: jobId, 
          establishmentId: establishmentId, 
          academicYearId: student.academicYearId,
          status: 'PENDING'
        }
      }),
      // อัปเดตสถานะที่ตาราง User
      prisma.user.update({
        where: { id: currentStudentId },
        data: {
          approvalStatus: 'PENDING',
          // 🚩 บัวเติม Number() ตรงนี้ให้แล้วจ้ะ เพื่อความเป๊ะ
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
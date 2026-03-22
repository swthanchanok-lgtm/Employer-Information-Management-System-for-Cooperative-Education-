import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // เปลี่ยนจาก import { prisma } เป็นสร้างใหม่ หรือใช้ตัวที่มีอยู่
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "ต้องล็อกอินก่อนนะจ๊ะแม่" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      studentId, 
      score, 
      comment, 
      visitDate,
      round // 🚩 รับค่า "ครั้งที่นิเทศ" มาจากหน้าเว็บด้วยนะแม่
    } = body;

    // 🔍 1. เช็คข้อมูลเด็กก่อนว่าสังกัดปีการศึกษาไหน
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) },
      include: { academicYear: true }
    });

    if (!student) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนักศึกษาจ้า" }, { status: 404 });
    }

    // 🚩 2. [ดักไว้ก่อน] ถ้าเด็กไม่ได้อยู่ในปีการศึกษาปัจจุบัน (isCurrent: true)
    // อาจารย์นิเทศไม่ควรจะบันทึกคะแนนย้อนหลังได้แบบสุ่มสี่สุ่มห้า
    if (!student.academicYear?.isCurrent) {
       return NextResponse.json({ 
         error: "อุ๊ยแม่! เด็กคนนี้ไม่ได้อยู่ในปีการศึกษาปัจจุบันนะจ๊ะ บันทึกไม่ได้จ้า" 
       }, { status: 400 });
    }

    // 🚩 3. บันทึกลงตาราง Supervision
    const newSupervision = await prisma.supervision.create({
      data: {
        studentId: Number(studentId),
        teacherId: Number(session.user.id),
        content: comment,
        round: Number(round) || 1, // ✅ ใช้ค่าที่ส่งมา ถ้าไม่มีให้เป็น 1
        score: score ? parseFloat(score) : null, // ✅ บันทึกคะแนน (อย่าลืมไปเพิ่มใน Schema นะแม่)
        createdAt: visitDate ? new Date(visitDate) : new Date(), 
        
        // 💡 คำแนะนำ: ถ้าแม่ยอมเพิ่มฟิลด์ academicYearId ในตาราง Supervision
        // แม่จะดึงคะแนนแยกปีได้ง่ายแบบ 300% เลยค่ะ!
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "บันทึกเรียบร้อยแล้วจ้าแม่ครีม!", 
      data: newSupervision 
    });

  } catch (error) {
    console.error("Save Evaluation Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "บันทึกไม่ได้จ้า เช็คชื่อฟิลด์หรือความสัมพันธ์ในฐานข้อมูลอีกทีน้า" 
    }, { status: 500 });
  }
}
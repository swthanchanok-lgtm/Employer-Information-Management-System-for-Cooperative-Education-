import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "ต้องล็อกอินก่อนนะจ๊ะแม่" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      studentId, 
      score, // ถ้าแม่จะใช้คะแนน ต้องไปเพิ่มฟิลด์ score ใน Model Supervision ก่อนนะจ๊ะ
      comment, 
      visitDate, 
      teacherSignature, 
      mentorSignature 
    } = body;

    // 🚩 บันทึกลงตาราง Supervision ตาม Schema ของแม่
    const newSupervision = await prisma.supervision.create({
      data: {
        studentId: Number(studentId),
        teacherId: Number(session.user.id), // ✅ ใช้ teacherId ตาม Schema เป๊ะ!
        
        content: comment,       // ✅ แมพเข้าฟิลด์ content (String? @db.Text)
        round: 1,               // ✅ ค่าเริ่มต้นเป็นครั้งที่ 1
        
        // หมายเหตุ: ใน Schema ของแม่ยังไม่มีฟิลด์ score, visitDate, signatures
        // ถ้าแม่กด Save แล้ว Error ให้ไปเพิ่มฟิลด์พวกนี้ใน schema.prisma แล้ว migrate นะจ๊ะ
        // หรือถ้ายังไม่เพิ่ม ให้คอมเมนต์บรรทัดข้างล่างนี้ไว้ก่อนจ้า
        createdAt: new Date(visitDate), 
        
        // imageUrl: "ใส่ URL รูปถ้ามี",
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
      error: "อุ๊ย! บันทึกลงฐานข้อมูลไม่ได้จ้า เช็คชื่อฟิลด์ใน Schema อีกทีน้า" 
    }, { status: 500 });
  }
}
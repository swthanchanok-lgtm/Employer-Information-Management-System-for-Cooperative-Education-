import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🚩 1. รับค่า scheduledDate เข้ามาด้วย
    const { studentId, teacherIds, scheduledDate } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "ต้องระบุ studentId จ้า" }, { status: 400 });
    }

    // ตรวจสอบก่อนว่า นักศึกษาคนนี้อยู่ใน "ปีการศึกษาปัจจุบัน" หรือไม่
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) },
      include: { academicYear: true }
    });

    if (!student) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนักศึกษาจ้า" }, { status: 404 });
    }

    // [ดักไว้ก่อน] ถ้าไม่ใช่เด็กปีปัจจุบัน ไม่ควรให้จัดกลุ่มมั่วซั่ว
    if (!student.academicYear?.isCurrent) {
      return NextResponse.json({ 
        error: "อุ๊ยแม่! เด็กคนนี้ไม่ได้อยู่ในปีการศึกษาปัจจุบัน จัดกลุ่มไม่ได้นะจ๊ะ" 
      }, { status: 400 });
    }

    // 🚩 2. แปลงวันที่ให้อยู่ในรูปแบบที่ Prisma เข้าใจ (ถ้ามีค่าส่งมา)
    const validDate = scheduledDate ? new Date(scheduledDate) : null;

    // ใช้การ Upsert ตามเดิม
    const group = await prisma.supervisionGroup.upsert({
      where: { studentId: Number(studentId) },
      update: {
        scheduledDate: validDate, // 🚩 3. อัปเดตวันที่
        instructors: {
          set: teacherIds.map((id: number) => ({ id: Number(id) }))
        }
      },
      create: {
        studentId: Number(studentId),
        scheduledDate: validDate, // 🚩 4. สร้างพร้อมวันที่ (ถ้าเป็นการจัดกลุ่มครั้งแรก)
        instructors: {
          connect: teacherIds.map((id: number) => ({ id: Number(id) }))
        }
      },
      include: {
        instructors: true,
        student: true
      }
    });

    return NextResponse.json({
      message: "จัดกลุ่มและตารางอาจารย์นิเทศเรียบร้อยแล้วจ้า!",
      data: group
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "บันทึกข้อมูลไม่สำเร็จจ้า", 
      details: error.message 
    }, { status: 500 });
  }
}
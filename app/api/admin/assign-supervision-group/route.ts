import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { studentId, teacherIds } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: "ต้องระบุ studentId จ้า" }, { status: 400 });
    }

    // 🚩 1. ตรวจสอบก่อนว่า นักศึกษาคนนี้อยู่ใน "ปีการศึกษาปัจจุบัน" หรือไม่
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) },
      include: { academicYear: true }
    });

    if (!student) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนักศึกษาจ้า" }, { status: 404 });
    }

    // 🚩 2. [ดักไว้ก่อน] ถ้าไม่ใช่เด็กปีปัจจุบัน ไม่ควรให้จัดกลุ่มมั่วซั่ว
    if (!student.academicYear?.isCurrent) {
      return NextResponse.json({ 
        error: "อุ๊ยแม่! เด็กคนนี้ไม่ได้อยู่ในปีการศึกษาปัจจุบัน จัดกลุ่มไม่ได้นะจ๊ะ" 
      }, { status: 400 });
    }

    // 🚩 3. ใช้การ Upsert ตามเดิม (เพราะ 1 คน มี 1 กลุ่มตาม Schema)
    // แต่ตอนนี้เรามั่นใจแล้วว่าเป็นเด็กปีปัจจุบันแน่นอน
    const group = await prisma.supervisionGroup.upsert({
      where: { studentId: Number(studentId) },
      update: {
        instructors: {
          // ล้างรายชื่ออาจารย์ชุดเก่า (ของเด็กคนนี้) แล้วใส่ชุดใหม่ที่เลือกมา
          set: teacherIds.map((id: number) => ({ id: Number(id) }))
        }
      },
      create: {
        studentId: Number(studentId),
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
      message: "จัดกลุ่มอาจารย์นิเทศเรียบร้อยแล้วจ้า!",
      data: group
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "บันทึกกลุ่มไม่สำเร็จจ้า", 
      details: error.message 
    }, { status: 500 });
  }
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { studentId, teacherIds } = await req.json();

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!studentId) {
      return NextResponse.json({ error: "ต้องระบุ studentId จ้า" }, { status: 400 });
    }

    // 2. ใช้การ Upsert (ถ้ามีกลุ่มอยู่แล้วให้แก้ ถ้าไม่มีให้สร้างใหม่)
    // และใช้การ set ใน relation เพื่อล้างรายชื่อเก่าและใส่รายชื่ออาจารย์ใหม่ตามที่ติ๊ก
    const group = await prisma.supervisionGroup.upsert({
      where: { studentId: studentId },
      update: {
        instructors: {
          set: teacherIds.map((id: number) => ({ id })) // ล้างของเก่าแล้วแทนที่ด้วยก้อนใหม่ที่ส่งมา
        }
      },
      create: {
        studentId: studentId,
        instructors: {
          connect: teacherIds.map((id: number) => ({ id }))
        }
      },
      include: {
        instructors: true // ส่งรายชื่อกลับไปอัปเดตหน้าจอด้วย
      }
    });

    return NextResponse.json(group);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "บันทึกกลุ่มไม่สำเร็จจ้า", details: error.message }, { status: 500 });
  }
}
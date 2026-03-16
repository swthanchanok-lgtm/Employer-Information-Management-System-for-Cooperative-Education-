import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth"; // ✅ เพิ่มตัวนี้
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // 🔒 1. ตรวจสอบสิทธิ์ผู้ใช้งานก่อนทำอะไรทั้งสิ้น
    const session = await getServerSession(authOptions);

    // ✅ เงื่อนไขใหม่: ต้องล็อกอิน และต้องเป็น COURSE_INSTRUCTOR เท่านั้น (ADMIN ก็ทำไม่ได้แล้วตามบรีฟแม่)
    if (!session || session.user.role !== "COURSE_INSTRUCTOR") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์ดำเนินการในส่วนนี้" }, { status: 403 });
    }

    const params = await context.params;
    const targetId = parseInt(params.id, 10);

    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body; 

    if (!status) {
      return NextResponse.json({ error: "ไม่พบสถานะที่ต้องการอัปเดต" }, { status: 400 });
    }

    // สั่ง Prisma อัปเดตข้อมูล
    const updatedEstablishment = await prisma.establishment.update({
      where: { id: targetId },
      data: { status: status },
    });

    return NextResponse.json({ message: "อัปเดตสำเร็จ", data: updatedEstablishment });
    
  } catch (error) {
    console.error("Error updating establishment:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}
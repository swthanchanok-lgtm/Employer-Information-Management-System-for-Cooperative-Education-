import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🚩 1. หา roleId จากชื่อ Role ที่ส่งมาจากฟอร์ม (เช่น STUDENT, ADMIN)
    const roleData = await prisma.role.findFirst({
      where: { name: body.role } 
    });

    if (!roleData) {
      return NextResponse.json({ message: "ไม่พบข้อมูลสิทธิ์ (Role) ในระบบ" }, { status: 400 });
    }

    // 🚩 2. บันทึกข้อมูลลง Model User
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        prefix: body.prefix || null,
        name: body.name,
        surname: body.surname || null,
        roleId: roleData.id, // ใช้ ID ที่หามาได้
        academicRank: body.academicRank || null,
        personnelType: body.role === 'STUDENT' ? 'นักศึกษา' : 'สายวิชาการ', // ตั้งค่าตาม Role
        faculty: body.faculty || null,
        department: body.department,
        position: body.position || null,
        // สถานะเริ่มต้นของนักศึกษา (ถ้าเป็นนักศึกษา)
        approvalStatus: body.role === 'STUDENT' ? 'NOT_SUBMITTED' : undefined,
      },
    });

    return NextResponse.json({ message: "บันทึกข้อมูลสำเร็จ", user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error("Database Error:", error);
    // กรณี Username หรือ Email ซ้ำ
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Username หรือ Email นี้มีในระบบแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการบันทึก", error: error.message }, { status: 500 });
  }
}
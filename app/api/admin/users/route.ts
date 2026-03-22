import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 🔒 เช็คก่อนว่าล็อกอินหรือยัง
    if (!session || !session.user) {
      return NextResponse.json({ error: "กรุณาล็อกอินก่อนดำเนินการ" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, address, website, phone, email, description, category,
      jobTitle, salary, hasShuttle, hasDorm
    } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและที่อยู่สถานประกอบการ' }, { status: 400 });
    }

    // 🚩 [หัวใจสำคัญ] เช็คสิทธิ์: 
    // ถ้าเป็น COURSE_INSTRUCTOR ให้สถานะเป็น APPROVED ทันที
    // ถ้าเป็นบทบาทอื่น (เช่น STUDENT) ให้เป็น PENDING เพื่อรออาจารย์มาตรวจ
    const isInstructor = session.user.role === "COURSE_INSTRUCTOR";
    const finalStatus = isInstructor ? "APPROVED" : "PENDING";

    const newEst = await prisma.establishment.create({
      data: {
        name,
        address,
        email: email || null,
        phone: phone || null,
        website: website || null,
        description: description || "",
        category: category || "General",
        status: finalStatus, 
        
        // บันทึก ID อาจารย์ผู้สร้าง/อนุมัติ (ถ้าแม่มีฟิลด์ approvedById ใน Model)
        ...(isInstructor && { approvedById: Number(session.user.id) }),

        // สร้างตำแหน่งงานพ่วงไปด้วย
        ...(jobTitle && {
          jobs: {
            create: {
              title: jobTitle,
              salary: salary ? parseInt(salary.toString()) : 0,
              hasShuttle: hasShuttle || false,
              hasDorm: hasDorm || false,
              status: finalStatus, // สถานะงานล้อตามสถานะบริษัท
            }
          }
        })
      },
      include: {
        jobs: true
      }
    });

    return NextResponse.json({ 
      message: isInstructor ? 'เพิ่มข้อมูลและอนุมัติใช้งานทันที' : 'บันทึกข้อมูลเรียบร้อย รออาจารย์ตรวจสอบนะจ๊ะ', 
      data: newEst 
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
}
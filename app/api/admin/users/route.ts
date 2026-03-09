import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // 1. ดึงข้อมูลจากฟอร์ม (รองรับฟิลด์ที่แม่มีในหน้าจอล่าสุด)
    const { 
      name, address, website, phone, email, description, category,
      jobTitle, salary, hasShuttle, hasDorm,
      status // 🚩 รับ status จากหน้าบ้าน (ถ้า Admin ส่งมาจะเป็น 'APPROVED')
    } = body;

    // 2. ตรวจสอบข้อมูลพื้นฐานที่จำเป็นจริงๆ
    if (!name || !address) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและที่อยู่สถานประกอบการ' }, { status: 400 });
    }

    // 3. กำหนดสถานะอัตโนมัติ (ถ้าไม่มี status ส่งมา ให้เช็คจากสิทธิ์คนล็อกอิน)
    // - ถ้า Admin เพิ่มเอง => APPROVED
    // - ถ้าคนอื่น (เด็ก) เพิ่ม => PENDING
    const finalStatus = status || (session?.user?.role === "ADMIN" ? "APPROVED" : "PENDING");

    // 4. บันทึกลง Database (รวมการสร้าง Job พ่วงไปด้วยถ้ามีการกรอกมา)
    const newEst = await prisma.establishment.create({
      data: {
        name,
        address,
        email: email || null,
        phone: phone || null,
        website: website || null,
        description: description || "",
        category: category || "General",
        status: finalStatus, // 👈 ใช้สถานะที่สรุปได้จากข้อ 3

        // 🔥 ถ้ามีการกรอกชื่อตำแหน่งงานมาด้วย ให้สร้าง Job พ่วงไปเลย (Nested Create)
        ...(jobTitle && {
          jobs: {
            create: {
              title: jobTitle,
              salary: salary ? parseInt(salary.toString()) : 0,
              hasShuttle: hasShuttle || false,
              hasDorm: hasDorm || false,
              status: finalStatus, // สถานะงานตามสถานะบริษัท
            }
          }
        })
      },
      include: {
        jobs: true
      }
    });

    console.log(`✅ [${finalStatus}] สร้างสถานประกอบการสำเร็จ:`, newEst.name);

    return NextResponse.json({ 
      message: finalStatus === 'APPROVED' ? 'เพิ่มและอนุมัติสำเร็จ' : 'บันทึกคำร้องสำเร็จ', 
      data: newEst 
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', details: error.message }, { status: 500 });
  }
}
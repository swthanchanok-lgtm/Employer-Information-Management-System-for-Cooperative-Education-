import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // 🚩 ใช้ prisma จาก lib กลางเพื่อป้องกันปัญหาสายซ้อน
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ 1. ฟังก์ชัน GET: (เหมือนเดิมของแม่เลยค่ะ)
export async function GET() {
  try {
    const establishments = await prisma.establishment.findMany({
      include: {
        reviews: true,
        jobs: true 
      }
    });
    return NextResponse.json(establishments);
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}

// ✅ 2. ฟังก์ชัน POST: ปรับปรุงให้รองรับทั้ง Admin และการสร้างแบบ Nested
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { 
      name, description, address, contact, category, imageUrl, mapUrl,
      jobTitle, salary, hasShuttle, hasDorm, email, phone, website,
      status // 🚩 รับค่า status จากฟอร์ม (Admin จะส่ง APPROVED มา)
    } = body;

    // 🚩 ตรวจสอบข้อมูลจำเป็น (ถ้าเป็น Admin จะเน้นแค่ชื่อและที่อยู่)
    if (!name || !address) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อและที่อยู่)' },
        { status: 400 }
      );
    }

    // 🚩 บันทึกลงฐานข้อมูล
    const newEst = await prisma.establishment.create({
      data: {
        name,
        address,
        // รองรับทั้ง contact แบบเดิม หรือแยก email/phone แบบใหม่
        contact: contact || phone || email || "", 
        category: category || "General", // ใส่ค่าเริ่มต้นถ้าไม่ได้ส่งมา
        description: description || "",
        imageUrl: imageUrl || "",
        mapUrl: mapUrl || "",
        website: website || "",
        // ถ้าระบุสถานะมา (เช่น Admin ส่งมา) ให้ใช้ตามนั้น ถ้าไม่มีให้เป็น PENDING
        status: status || (session?.user?.role === "ADMIN" ? "APPROVED" : "PENDING"),
        
        // 🔥 ถ้ามีการส่งข้อมูลงานมาด้วย ค่อยสร้าง Job พ่วงไป
        ...(jobTitle && {
          jobs: {
            create: {
              title: jobTitle,
              salary: salary ? parseInt(salary.toString()) : 0,
              hasShuttle: hasShuttle || false,
              hasDorm: hasDorm || false,
              status: status || "PENDING"
            }
          }
        })
      },
      include: { jobs: true }
    });

    return NextResponse.json(newEst, { status: 201 });
  } catch (error: any) {
    console.error('Error creating establishment:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', details: error.message }, 
      { status: 500 }
    );
  }
}
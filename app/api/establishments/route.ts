import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const establishments = await prisma.establishment.findMany({
      include: {
        reviews: true,
        jobs: true 
      }
    });

    // 🚩 เพิ่มขั้นตอนคำนวณค่าเฉลี่ยก่อนส่งออกไปจ้า
    const dataWithRating = establishments.map((est) => {
      // คำนวณหาค่าเฉลี่ยจากอาเรย์ reviews
      const totalRating = est.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = est.reviews.length > 0 ? totalRating / est.reviews.length : 0;

      return {
        ...est,
        averageRating: averageRating, // 👈 ส่งตัวนี้ออกไป หน้าบ้านถึงจะเห็นดาวจ้า!
      };
    });

    return NextResponse.json(dataWithRating);
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { 
      name, description, address, category, imageUrl, mapUrl,
      jobTitle, salary, hasShuttle, hasDorm, phone, 
      status 
    } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อและที่อยู่)' },
        { status: 400 }
      );
    }

    const newEst = await prisma.establishment.create({
      data: {
        name,
        address,
        contact: phone || "", // ✅ ใช้เบอร์โทรที่แม่กรอกมาเป็น Contact
        category: category || "General", 
        description: description || "",
        imageUrl: imageUrl || "",
        mapUrl: mapUrl || "",
        // ❌ เอา website ออกแล้วจ้า! (ต้นเหตุที่ทำให้บึ้ม)
        status: status || (session?.user?.role === "ADMIN" ? "APPROVED" : "PENDING"),
        
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
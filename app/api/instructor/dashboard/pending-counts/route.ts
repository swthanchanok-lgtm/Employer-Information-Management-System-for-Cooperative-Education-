// 🚩 app/api/dashboard/pending-counts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 💡 แก้ path prisma ให้ตรงกับของแม่นะจ๊ะ

export async function GET() {
  try {
    // 1. นับสถานประกอบการที่รออนุมัติ
    // 💡 (ถ้าฟิลด์สถานะของแม่ไม่ได้ชื่อ status หรือไม่ได้ใช้คำว่า 'PENDING' แก้ให้ตรง schema นะจ๊ะ)
    const pendingEstCount = await prisma.establishment.count({
      where: { status: 'PENDING' } 
    });

    // 2. นับตำแหน่งงานที่รออนุมัติ
    const pendingJobCount = await prisma.job.count({
      where: { status: 'PENDING' }
    });

    // 3. 🌟 นับคำร้องขอฝึกงานของเด็กๆ ที่รออนุมัติ (เพิ่มใหม่!)
    const pendingAppCount = await prisma.application.count({
      where: { status: 'PENDING' }
    });

    return NextResponse.json({ 
      pendingEstCount, 
      pendingJobCount,
      pendingAppCount
    });

  } catch (error) {
    console.error("Error fetching pending counts:", error);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}
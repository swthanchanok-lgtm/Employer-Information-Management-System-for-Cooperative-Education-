import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🟢 1. ฟังก์ชันดึงข้อมูลงาน (GET) - สำหรับหน้า Admin และ Dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // รับค่า status จาก URL เช่น ?status=PENDING
    const status = searchParams.get('status');
    
    const whereCondition = status ? { status: status } : {}; // ถ้าไม่ระบุ status ให้ดึงมาทั้งหมดเลย

    const jobs = await prisma.job.findMany({
      // 🚩 ถ้ามีการส่ง status มาให้กรองตามนั้น ถ้าไม่มีให้ดึงทั้งหมด (หรือดึง PENDING เป็นหลัก)
      where: status ? { status: status } : { status: 'PENDING' }, 
      include: { 
        establishment: true 
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔵 2. ฟังก์ชันเพิ่มงานใหม่ (POST) - สำหรับให้นักศึกษา/อาจารย์ส่งเรื่องเพิ่มงาน
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { establishmentId, title, salary, hasShuttle, hasDorm } = body;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!establishmentId || !title) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        salary: parseInt(salary.toString()) || 0,
        hasShuttle: !!hasShuttle,
        hasDorm: !!hasDorm,
        establishmentId: parseInt(establishmentId.toString()),
        status: "PENDING", // 🚩 บันทึกปุ๊บ ให้ติดสถานะรออนุมัติทันที
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// 📍 ไฟล์: app/api/academic-years/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { year, semester, instructorId } = body;

    // 🚩 1. แปลงค่าเป็น Number ให้หมดก่อนเข้า Database
    // เพราะใน Schema แม่ตั้งทุกอย่างเป็น Int จ้า
    const parsedYear = Number(year);
    const parsedSemester = Number(semester);
    const parsedInstructorId = Number(instructorId);

    // เช็คกันเหนียวว่าแปลงออกมาแล้วเป็นตัวเลขจริงๆ ไม่ใช่ NaN
    if (isNaN(parsedYear) || isNaN(parsedSemester) || isNaN(parsedInstructorId)) {
      return NextResponse.json({ 
        error: "ข้อมูลไม่ถูกต้องจ้าแม่", 
        details: "ปี, เทอม และ ID อาจารย์ต้องเป็นตัวเลขนะจ๊ะ" 
      }, { status: 400 });
    }

    const newYear = await prisma.academicYear.create({
      data: {
        year: parsedYear,
        semester: parsedSemester,
        createdById: parsedInstructorId, // 🚩 ใช้ ID ที่แปลงเป็นตัวเลขแล้ว
        
        // 🚩 บันทึกความสัมพันธ์ลงตาราง AcademicYearInstructor ไปพร้อมกัน
        AcademicYearInstructor: {
          create: { 
            instructorId: parsedInstructorId 
          }
        }
      }
    });

    return NextResponse.json(newYear);

  } catch (error: any) {
    console.error("❌ บั๊กเจ้ากรรม:", error);

    // 🚩 2. เช็ค Error เฉพาะทางจาก Prisma (P2002 คือข้อมูลซ้ำ)
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "ปีและเทอมนี้มีอยู่แล้วจ้าแม่" 
      }, { status: 400 });
    }

    // ถ้าพังอย่างอื่น ให้บอก Error จริงๆ ออกมาเลยแม่จะได้แก้ถูก
    return NextResponse.json({ 
      error: "พังจ้า สร้างไม่ได้", 
      details: error.message 
    }, { status: 400 });
  }
}
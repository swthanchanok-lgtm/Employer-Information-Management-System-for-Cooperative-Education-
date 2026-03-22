import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// 🔴 ของเดิมของแม่ (POST) ไม่ได้แตะเลยจ้า
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { year, semester, instructorId, setAsCurrent } = body; 

    const parsedYear = Number(year);
    const parsedSemester = Number(semester);
    const parsedInstructorId = Number(instructorId);

    if (isNaN(parsedYear) || isNaN(parsedSemester) || isNaN(parsedInstructorId)) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้องจ้า ปี/เทอม/ID ต้องเป็นตัวเลขนะ" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (setAsCurrent) {
        await tx.academicYear.updateMany({
          data: { isCurrent: false }
        });
      }

      return await tx.academicYear.create({
        data: {
          year: parsedYear,
          semester: parsedSemester,
          createdById: parsedInstructorId,
          isCurrent: setAsCurrent || false, 
          
          AcademicYearInstructor: {
            create: { 
              instructorId: parsedInstructorId 
            }
          }
        }
      });
    });

    return NextResponse.json({ 
      message: "สร้างปีการศึกษาใหม่สำเร็จแล้วจ้าแม่!", 
      data: result 
    });

  } catch (error: any) {
    console.error("❌ บั๊กเจ้ากรรม:", error);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: "ปีและเทอมนี้มีอยู่แล้วจ้าแม่ ไม่ต้องสร้างซ้ำนะ" }, { status: 400 });
    }

    return NextResponse.json({ 
      error: "พังจ้า สร้างไม่ได้", 
      details: error.message 
    }, { status: 500 });
  }
}

// ==========================================
// 🟢 ของใหม่ที่บัวเติมให้ (GET) สำหรับดึงข้อมูลไปโชว์
// ==========================================
export async function GET() {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: [
        { year: 'desc' },
        { semester: 'desc' }
      ]
    });
    
    return NextResponse.json(academicYears);
  } catch (error) {
    console.error("Fetch Academic Years Error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลปีการศึกษาไม่ได้จ้า" }, { status: 500 });
  }
}
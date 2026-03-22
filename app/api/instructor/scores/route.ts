import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // 🔍 1. หาปีการศึกษาปัจจุบันที่ระบุว่าเป็น "isCurrent" 
    // หรือถ้าแม่ส่ง academicYearId มาจากหน้าเว็บก็ใช้ตัวนั้น
    const { searchParams } = new URL(req.url);
    const selectedYearId = searchParams.get('academicYearId');

    let targetYearId: number | null = selectedYearId ? parseInt(selectedYearId) : null;

    // ถ้าไม่ได้เลือกปีมา ให้ไปหาปีการศึกษาที่ตั้งค่าเป็น isCurrent: true ไว้ในระบบอัตโนมัติ
    if (!targetYearId) {
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true }
      });
      targetYearId = currentYear?.id || null;
    }

    // 🔍 2. ดึงรายชื่อนักศึกษา "เฉพาะ" ในปีการศึกษาที่เลือก/ปัจจุบันเท่านั้น
    const students = await prisma.user.findMany({
      where: {
        role: { name: 'STUDENT' },
        academicYearId: targetYearId, // 🚩 กรองตรงนี้แหละจ้ะแม่! เด็กปีอื่นจะไม่หลุดมาเลย
      },
      include: {
        evaluations: {
          include: { answers: true }
        },
        supervisionsReceived: true 
      }
    });

    const formattedStudents = students.map((student: any) => {
      // (ส่วนคำนวณคะแนน form1Score, form2Score เหมือนเดิมเป๊ะเลยจ้ะแม่)
      let form1Score = student.evaluations[0]?.answers.reduce((sum: number, ans: any) => sum + (ans.score || 0), 0) || null;
      let form2Score = student.supervisionsReceived[0]?.score || null;

      return {
        id: student.id,
        studentId: student.username || student.id,
        name: `${student.prefix || ''}${student.name || ''} ${student.surname || ''}`.trim(),
        branch: student.department,
        form1Score, 
        form2Score,
        totalScore: (form1Score || 0) + (form2Score || 0),
        status: (form1Score === null && form2Score === null) ? 'ยังไม่ได้รับการประเมิน' : 'มีการประเมินแล้ว'
      };
    });

    return NextResponse.json(formattedStudents);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
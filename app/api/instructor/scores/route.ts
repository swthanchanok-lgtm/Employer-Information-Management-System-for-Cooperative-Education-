import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const selectedYearId = searchParams.get('academicYearId');

    let targetYearId: number | null = selectedYearId ? parseInt(selectedYearId) : null;

    if (!targetYearId) {
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true }
      });
      targetYearId = currentYear?.id || null;
    }

    const students = await prisma.user.findMany({
      where: {
        roleId: 4, // มั่นใจว่า roleId 4 คือนักศึกษา
        academicYearId: targetYearId,
      },
      include: {
        evaluations: {
          orderBy: { id: 'desc' }, // ดึงตัวล่าสุดขึ้นมาก่อน
          include: { answers: true }
        }
      }
    });

    const formattedStudents = students.map((student: any) => {
      const evals = student.evaluations || [];

      // ฟังก์ชันรวมคะแนน
      const calculateScore = (formId: number) => {
        const found = evals.find((e: any) => Number(e.formId) === formId && e.answers?.length > 0);
        if (!found) return null;
        return found.answers.reduce((sum: number, ans: any) => sum + (ans.score || 0), 0);
      };

      const f1 = calculateScore(1);
      const f2 = calculateScore(2);
      const f3 = calculateScore(3); // 🎯 ฟอร์ม 3 ที่เราตามหากันมา 3 ชม.!

      return {
        id: student.id,
        studentId: student.username,
        name: `${student.prefix || ''}${student.name || ''} ${student.surname || ''}`.trim() || 'ไม่ระบุชื่อ',
        branch: student.branch || 'สาขาวิชาวิศวกรรมคอมพิวเตอร์',
        form1Score: f1,
        form2Score: f2,
        form3Score: f3,
        totalScore: (f1 || 0) + (f2 || 0) + (f3 || 0),
        status: evals.length > 0 ? 'มีการประเมินแล้ว' : 'ยังไม่ได้รับการประเมิน'
      };
    });

    return NextResponse.json(formattedStudents);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
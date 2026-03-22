import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. ดึงข้อมูลนักศึกษาทั้งหมด
    const students = await prisma.user.findMany({
      where: { 
        roleId: 4, // 🚩 roleId ของนักศึกษา
      },
      include: {
        evaluations: {
          orderBy: { id: 'asc' }, // เรียงตามลำดับการประเมินก่อน-หลัง
          include: {
            answers: true // ดึงคำตอบมาบวกคะแนน
          }
        }
      }
    });

    // 2. จัดรูปแบบข้อมูลให้ตรงกับตาราง UI
    const formattedData = students.map((student) => {
      
      // 🚩 ดึงข้อมูลคะแนนจากฟอร์มที่มีอยู่ทั้งหมด (ไม่สน ID แล้วจ้า ดึงตามลำดับเลย)
      const evals = (student as any).evaluations || [];

      // ฟังก์ชันรวมคะแนน
      const calculateScore = (evaluationData: any) => {
        if (!evaluationData) return null;
        return evaluationData.answers.reduce((sum: number, ans: any) => sum + (ans.score || 0), 0);
      };

      // จับใส่ช่องตามลำดับ 1, 2, 3 ที่เจอเลยจ้า
      const form1Score = evals[0] ? calculateScore(evals[0]) : null;
      const form2Score = evals[1] ? calculateScore(evals[1]) : null;
      const form3Score = evals[2] ? calculateScore(evals[2]) : null;

      // รวมคะแนนทั้งหมด
      let totalScore = null;
      if (form1Score !== null || form2Score !== null || form3Score !== null) {
        totalScore = (form1Score || 0) + (form2Score || 0) + (form3Score || 0);
      }

      return {
        id: student.id,
        studentId: student.username,
        name: `${student.prefix || ''}${student.name} ${student.surname || ''}`.trim(),
        branch: (student as any).department?.name || (student as any).department || 'ไม่ระบุสาขา', 
        
        form1Score: form1Score, 
        form2Score: form2Score, 
        form3Score: form3Score,
        totalScore: totalScore
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ error: 'ดึงข้อมูลคะแนนไม่ได้จ้า' }, { status: 500 });
  }
}
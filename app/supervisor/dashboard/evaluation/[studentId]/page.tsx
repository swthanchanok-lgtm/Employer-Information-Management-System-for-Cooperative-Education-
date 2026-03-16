// 🚩 app/supervisor/dashboard/evaluation/[studentId]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EvaluationForm from "@/app/evaluation/[formId]/EvaluationForm";

export default async function EvaluationPage({ params }: any) {
  const resolvedParams = await params;
  const studentId = parseInt(resolvedParams.studentId);
  
  if (!studentId || isNaN(studentId)) {
    return <div className="p-10 text-center font-bold text-red-500">❌ รหัสนักศึกษาไม่ถูกต้องจ้าแม่</div>;
  }

  try {
    // 1. ดึงข้อมูลนักศึกษา
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { 
        establishment: true,
        supervisionGroup: {
          include: {
            student: true 
          }
        }
      }
    });

    // 2. 🚩 ดึงข้อมูล "ทุกฟอร์ม" ที่ต้องใช้ใน 3 Step (อ้างอิงตามชื่อใน Seed ของแม่)
    const allForms = await prisma.form.findMany({
  include: { questions: { orderBy: { orderIndex: 'asc' } } }
});

console.log("ฟอร์มที่หาเจอทั้งหมด:", allForms.map(f => f.title)); // ดูใน Terminal ว่ามีชื่อฟอร์มไหม

const sortedForms = [
  allForms.find(f => f.title.includes('สัมภาษณ์นักศึกษา')) || allForms[0], // ถ้าหาชื่อไม่เจอ เอาอันแรกมากันตาย
  allForms.find(f => f.title.includes('สัมภาษณ์พี่เลี้ยง')) || allForms[1],
  allForms.find(f => f.title.includes('ความพึงพอใจ')) || allForms[2]
];

    // ✅ ส่ง forms (มี s) ที่เป็น Array เข้าไปให้ลูกตามที่ตกลงกันไว้
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <EvaluationForm student={student} forms={sortedForms} />
      </div>
    );

  } catch (error) {
    console.error("Evaluation Page Error:", error);
    return <div className="p-10 text-center font-bold text-red-500">เกิดข้อผิดพลาดในการดึงข้อมูลจ้าแม่</div>;
  }
}
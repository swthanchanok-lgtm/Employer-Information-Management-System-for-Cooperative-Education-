// 📄 ไฟล์: app/supervisor/dashboard/evaluation/[formId]/page.tsx

import { prisma } from '@/lib/prisma' 
import EvaluationForm from './EvaluationForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ formId: string }>
  searchParams: Promise<{ studentId?: string }>
}

export default async function EvaluationPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params 
  const resolvedSearchParams = await searchParams
  
  // 1. 🚩 ดึง ID จาก searchParams (ต้องมั่นใจว่าหน้าที่แล้วส่งมาชื่อ studentId)
  const studentId = resolvedSearchParams.studentId

  if (!studentId) return notFound()

  // 2. 🚩 ดึงข้อมูลจากตาราง User โดยระบุ ID ของนักศึกษาคนนั้นๆ
  const studentData = await prisma.user.findUnique({
    where: { 
      id: Number(studentId) // ✅ นี่คือจุดตาย! ต้องใช้ ID ที่รับมาจาก URL เท่านั้น
    },
    include: { 
      establishment: true, // ดึงข้อมูลที่ทำงาน (ถ้า Relation ใน Schema ชื่อนี้)
    }
  })

  // 3. ตรวจสอบว่าเจอตัวไหม และเป็นนักศึกษาจริงหรือเปล่า (ถ้าแม่มี role เก็บไว้)
  if (!studentData) return notFound()

  // 3. ดึงฟอร์มที่ต้องการใช้
  const allForms = await prisma.form.findMany({
    where: {
      title: {
        in: [
          'แบบสัมภาษณ์นักศึกษา (โดยอาจารย์นิเทศ)',
          'แบบสัมภาษณ์พี่เลี้ยง (โดยอาจารย์นิเทศ)',
          'แบบประเมินความพึงพอใจของสถานประกอบการต่อการรับนักศึกษา'
        ]
      }
    },
    include: {
      questions: { orderBy: { orderIndex: 'asc' } },
    },
  })

  if (allForms.length === 0) return notFound()

  // จัดเรียงฟอร์มให้ตรงตามลำดับ Step
  const sortedForms = [
    allForms.find(f => f?.title.includes('สัมภาษณ์นักศึกษา')), 
    allForms.find(f => f?.title.includes('สัมภาษณ์พี่เลี้ยง')),
    allForms.find(f => f?.title.includes('ความพึงพอใจ'))
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ✅ ส่ง studentData ที่เราเพิ่งดึงสดๆ เข้าไปในฟอร์ม */}
        <EvaluationForm forms={sortedForms} student={studentData} />
      </div>
    </div>
  )
}
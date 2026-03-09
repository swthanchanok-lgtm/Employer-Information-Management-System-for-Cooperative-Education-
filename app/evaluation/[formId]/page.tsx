import { prisma } from '../../../lib/prisma' // <-- แก้เป็นแบบนี้ ชัวร์สุด
import EvaluationForm from './EvaluationForm'
import { notFound } from 'next/navigation'

// กำหนด Type ให้เป็น Promise ตามกฎใหม่ของ Next.js 15
interface PageProps {
  params: Promise<{ formId: string }>
}

export default async function EvaluationPage({ params }: PageProps) {
  // 1. "รอ" ให้ params โหลดเสร็จก่อน (สำคัญมาก!)
  const resolvedParams = await params 
  const formId = parseInt(resolvedParams.formId)
  
  // เช็คว่าเป็นตัวเลขไหม
  if (isNaN(formId)) return notFound()

  // 2. ดึงข้อมูล
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!form) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <EvaluationForm form={form} />
      </div>
    </div>
  )
}
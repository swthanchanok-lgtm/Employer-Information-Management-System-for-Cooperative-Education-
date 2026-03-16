'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitEmployerEvaluation } from '@/app/actions/submitEmployerEvaluation'
import { getFormQuestions } from '@/app/actions/getFormQuestions' // 🚩 อิมพอร์ตตัวดึงคำถาม

function EmployerEvaluationContent() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  
  const [formContent, setFormContent] = useState<any>(null) // เก็บข้อมูลฟอร์มจาก DB
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})

  // 🚩 ดึงคำถามจาก Seed (Form ID: 3) มาใช้ตอนโหลดหน้า
  useEffect(() => {
    async function loadForm() {
      const data = await getFormQuestions(3) // ดึงฟอร์มที่ 3
      setFormContent(data)
    }
    loadForm()
  }, [])

  const handleAnswerChange = (qId: number, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId) return alert('ไม่พบรหัสนักศึกษา')
    setIsSubmitting(true)

    // แปลงคำตอบส่งให้ "บุรุษไปรษณีย์"
    const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
      question_id: Number(qId),
      score: typeof val === 'number' ? val : null,
      answer_text: typeof val === 'string' ? val : null
    }))

    const payload = {
      formId: 3,
      studentId: Number(studentId),
      answers: formattedAnswers
    }

    try {
      const result = await submitEmployerEvaluation(payload)
      if (result.success) {
        setIsFinished(true)
        window.scrollTo(0, 0)
      } else {
        alert('อุ๊ย! บันทึกไม่สำเร็จ: ' + result.message)
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <h1 className="text-2xl font-black text-emerald-600">บันทึกเรียบร้อย!</h1>
          <p className="text-slate-500 font-bold">ขอบพระคุณพี่เลี้ยงที่สละเวลาประเมินให้นักศึกษาจ้า</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/50 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header (สวยเหมือนเดิม) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-b-8 border-emerald-500 text-center">
          <h1 className="text-2xl font-black text-[#2B4560]">{formContent?.title || 'แบบประเมินความพึงพอใจ'}</h1>
          <p className="text-emerald-600 font-bold italic">สำหรับสถานประกอบการ (พี่เลี้ยง)</p>
          <div className="mt-4 py-2 px-4 bg-emerald-50 rounded-full inline-block text-sm font-bold text-emerald-700">
            👤 รหัสนักศึกษาที่ประเมิน: {studentId}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🚩 ลูปคำถามที่ดึงมาจาก Database จริงๆ */}
          {formContent?.questions?.map((q: any, index: number) => (
            <div key={q.id} className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100">
              <p className="font-bold text-slate-700 mb-4">{index + 1}. {q.questionText}</p>
              
              {q.inputType === 'rating' ? (
                <div className="flex justify-between items-center px-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label key={score} className="text-center group">
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        required 
                        className="peer sr-only" 
                        onChange={() => handleAnswerChange(q.id, score)}
                      />
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 transition-all cursor-pointer">
                        {score}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" 
                  rows={4} 
                  placeholder="ระบุข้อเสนอแนะ..."
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button 
            type="submit" 
            disabled={isSubmitting || !formContent}
            className="w-full bg-[#2B4560] text-white font-black py-5 rounded-full shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-slate-300"
          >
            {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมิน ✅'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function EmployerEvaluationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">กำลังโหลดคำถามจากระบบ...</div>}>
      <EmployerEvaluationContent />
    </Suspense>
  )
}
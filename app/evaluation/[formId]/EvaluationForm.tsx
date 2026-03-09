'use client'

import { useState } from 'react'
import { submitEvaluation } from '@/app/actions/submitEvaluation' // Action ที่เราสร้างกันไว้ก่อนหน้านี้
import { useRouter } from 'next/navigation'

// กำหนด Type ให้ตรงกับ Database
type Question = {
  id: number
  questionText: string
  inputType: string
  orderIndex: number
}

type FormProps = {
  form: {
    id: number
    title: string
    description: string | null
    questions: Question[]
  }
}

export default function EvaluationForm({ form }: FormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State เก็บคำตอบ: { questionId: value }
  const [answers, setAnswers] = useState<Record<number, string | number>>({})

  // ฟังก์ชันอัปเดตคำตอบ
  const handleAnswerChange = (qId: number, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  // ฟังก์ชันกดส่ง
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('ยืนยันการส่งแบบประเมิน?')) return

    setIsSubmitting(true)

    // ข้อมูลสมมติ (ของจริงต้องดึงจาก Login Session)
    const mockEvaluatorId = 101 
    const mockStudentId = 505

    // แปลงข้อมูลให้ตรงกับรูปแบบที่ Server Action ต้องการ
    const payload = {
      formId: form.id,
      evaluatorId: mockEvaluatorId,
      studentId: mockStudentId,
      answers: Object.entries(answers).map(([qId, val]) => ({
        question_id: Number(qId),
        score: typeof val === 'number' ? val : null,
        answer_text: typeof val === 'string' ? val : null,
      })),
    }

    try {
      const result = await submitEvaluation(payload)
      if (result.success) {
        alert('บันทึกสำเร็จ! ขอบคุณสำหรับการประเมิน')
        router.push('/') // ส่งเสร็จกลับหน้าแรก
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.message)
      }
    } catch (error) {
      alert('Error connecting to server')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg overflow-hidden">
      
      {/* ส่วนหัว Header */}
      <div className="bg-blue-600 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        <p className="mt-2 text-blue-100">{form.description}</p>
      </div>

      {/* ส่วนคำถาม Loop ตามข้อมูลจริง */}
      <div className="p-8 space-y-8">
        {form.questions.map((q, index) => (
          <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                {index + 1}
              </span>
              <p className="text-gray-800 font-medium mt-1 text-lg">
                {q.questionText}
              </p>
            </div>

            {/* แสดงผลตามประเภทคำถาม */}
            <div className="pl-11">
              {q.inputType === 'rating' ? (
                // --- แบบ Rating (1-5) ---
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label key={score} className="cursor-pointer group">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={score}
                        className="peer sr-only" // ซ่อน Radio ปุ่มเดิม
                        onChange={() => handleAnswerChange(q.id, score)}
                        required
                      />
                      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 font-medium transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white hover:border-blue-300">
                        {score}
                      </div>
                      <span className="text-xs text-center block mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {score === 1 ? 'น้อย' : score === 5 ? 'มาก' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                // --- แบบ Textarea (ข้อเขียน) ---
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow min-h-[120px]"
                  placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  required
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มกดส่ง */}
      <div className="px-8 py-6 bg-gray-50 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'ส่งผลการประเมิน'}
        </button>
      </div>
    </form>
  )
}
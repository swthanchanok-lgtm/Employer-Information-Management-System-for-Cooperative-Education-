'use client'

import { useState, useRef } from 'react'
import { submitEvaluation } from '@/app/actions/submitEvaluation'
import { useRouter } from 'next/navigation'
import { SignatureBlock } from '@/components/SignatureBlock'
import { useSession } from 'next-auth/react'

type FormProps = {
  forms: any[]
  student: any
}

export default function EvaluationForm({ forms, student }: FormProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  const sigRefTeacher = useRef<any>(null)
  const sigRefMentor = useRef<any>(null)

  const form1 = forms?.[0]
  const form2 = forms?.[1]

  const handleAnswerChange = (qId: number, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const nextStep = () => {
    window.scrollTo(0, 0)
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    window.scrollTo(0, 0)
    setCurrentStep(prev => prev - 1)
  }

  // 👇👇👇 บัวแก้เฉพาะตรงนี้จ้า: แยกเซฟฟอร์ม 1 กับฟอร์ม 2 👇👇👇
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 3) {
      nextStep()
      return
    }

    if (!confirm('ยืนยันการบันทึกข้อมูลทั้งหมด?')) return
    setIsSubmitting(true)

    const teacherSig = sigRefTeacher.current?.getCanvas().isEmpty() ? null : sigRefTeacher.current?.getCanvas().getTrimmedCanvas().toDataURL('image/png')
    const mentorSig = sigRefMentor.current?.getCanvas().isEmpty() ? null : sigRefMentor.current?.getCanvas().getTrimmedCanvas().toDataURL('image/png')

    // 🚩 1. จัดรูปแบบคำตอบทั้งหมดก่อน (กรอง ID ปลอมออก)
    const formattedAnswers = Object.entries(answers)
      .filter(([qId]) => Number(qId) < 1000) 
      .map(([qId, val]) => {
        const id = Number(qId);
        const note = answers[id + 1000];

        return {
          question_id: id,
          score: typeof val === 'number' ? val : null,
          answer_text: typeof val === 'string' ? val : (note ? String(note) : null),
        };
      });

    // 🚩 2. แยกคำตอบให้ "ฟอร์ม 1"
    const form1QuestionIds = form1?.questions?.map((q: any) => q.id) || [];
    const form1Answers = formattedAnswers.filter(a => form1QuestionIds.includes(a.question_id));

    // 🚩 3. แยกคำตอบให้ "ฟอร์ม 2"
    const form2QuestionIds = form2?.questions?.map((q: any) => q.id) || [];
    const form2Answers = formattedAnswers.filter(a => form2QuestionIds.includes(a.question_id));

    try {
      // 🚀 ยิง API รอบที่ 1: บันทึกของฟอร์ม 1
      const res1 = await submitEvaluation({
        formId: Number(form1?.id),
        evaluatorId: Number(session?.user?.id),
        studentId: Number(student?.id),
        teacherSignature: teacherSig,
        mentorSignature: mentorSig,
        answers: form1Answers,
      });

      // 🚀 ยิง API รอบที่ 2: บันทึกของฟอร์ม 2
      const res2 = await submitEvaluation({
        formId: Number(form2?.id),
        evaluatorId: Number(session?.user?.id),
        studentId: Number(student?.id),
        teacherSignature: teacherSig,
        mentorSignature: mentorSig,
        answers: form2Answers,
      });

      if (res1.success && res2.success) {
        alert('บันทึกสำเร็จครบทั้ง 2 ส่วนแล้วจ้าแม่! กำลังไปหน้า QR Code นะจ๊ะ')
        router.push(`/instructor/generate-qr?studentId=${student?.id}`)
      } else {
        alert('อุ๊ย! มีบางส่วนบันทึกไม่สมบูรณ์จ้า ลองใหม่อีกทีนะ')
      }
    } catch (error) {
      console.error("Submit Error:", error)
      alert('ติดต่อ Server ไม่ได้จ้าแม่')
    } finally {
      setIsSubmitting(false)
    }
  }
  // 👆👆👆 จบส่วนที่แก้จ้า 👆👆👆

  if (!student?.id) return <div className="p-10 text-center">❌ ไม่พบข้อมูลนักศึกษา</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 pb-20">

      {/* --- ส่วนหัว (โชว์ทุก Step) --- */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8 text-slate-700">
        <div className="text-center space-y-2">
          <p className="text-sm font-black text-blue-600 tracking-widest uppercase">Step {currentStep} of 3</p>
          <h2 className="text-2xl font-black italic text-[#2B4560]">แบบบันทึกการนิเทศงานสหกิจศึกษา</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
          <p><strong>ชื่อสถานประกอบการ:</strong> {student?.establishment?.name || 'ไม่ระบุ'}</p>
          <p><strong>นักศึกษา:</strong> {student?.name || 'ไม่ระบุ'}</p>
          <p><strong>สาขาวิชา:</strong> {student?.department || 'ไม่ระบุ'}</p>
          <p><strong>เบอร์โทรศัพท์:</strong> {student?.establishment?.contact || 'ไม่ระบุ'}</p>
        </div>
      </div>

      {/* 🟢 STEP 1: ลายเซ็น + แบบสัมภาษณ์นักศึกษา */}
      {currentStep === 1 && (
        <>
          {/* ✅ ย้ายมาไว้ตรงนี้ ตามที่แม่ต้องการ: อยู่ในส่วนที่ 1 ก่อนคำชี้แจง */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <p className="font-black text-[#2B4560] mb-4 text-center">ลายเซ็นอาจารย์นิเทศ</p>
              <SignatureBlock ref={sigRefTeacher} name={session?.user?.name || "..................."} position="อาจารย์นิเทศ" />
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <p className="font-black text-[#2B4560] mb-4 text-center">ลายเซ็นพี่เลี้ยง</p>
              <SignatureBlock ref={sigRefMentor} name="..................." position="พี่เลี้ยง/ผู้ประเมิน" />
            </div>
          </div>

          <div className="bg-amber-50 border-l-8 border-amber-400 p-6 rounded-r-[2rem] shadow-sm">
            <h3 className="text-xl font-black text-amber-900 mb-2">💡 คำชี้แจง</h3>
            <p className="text-amber-800 font-bold text-sm">เกณฑ์การประเมิน: 5 (มากที่สุด) - 1 (น้อยที่สุด)</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10">
            <h3 className="text-xl font-black text-blue-600 border-b pb-4">ส่วนที่ 1: {form1?.title || 'แบบสัมภาษณ์นักศึกษา'}</h3>
            {form1?.questions?.filter((q: any) => q.questionText !== 'หมายเหตุ').map((q: any, index: number) => (
              <QuestionItem key={q.id} q={q} index={index} handleAnswerChange={handleAnswerChange} />
            ))}
          </div>
        </>
      )}

      {/* 🔵 STEP 2: แบบสัมภาษณ์พี่เลี้ยง */}
      {currentStep === 2 && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10">
          <h3 className="text-xl font-black text-emerald-600 border-b pb-4">ส่วนที่ 2: {form2?.title || 'แบบสัมภาษณ์พี่เลี้ยง'}</h3>
          {form2?.questions?.filter((q: any) => q.questionText !== 'หมายเหตุ').map((q: any, index: number) => (
            <QuestionItem key={q.id} q={q} index={index} handleAnswerChange={handleAnswerChange} />
          ))}
        </div>
      )}

      {/* 🟠 STEP 3: รูปถ่าย */}
      {currentStep === 3 && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-black text-[#2B4560] mb-4">📸 รูปถ่ายขณะนิเทศงาน</h3>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:bg-slate-100 file:text-[#2B4560] cursor-pointer" />
          </div>
        </div>
      )}

      {/* --- ปุ่มนำทาง --- */}
      <div className="flex justify-between items-center pt-10">
        {currentStep > 1 ? (
          <button type="button" onClick={prevStep} className="bg-slate-200 text-slate-600 font-black py-4 px-10 rounded-full hover:bg-slate-300 transition-all">
            ⬅ ย้อนกลับ
          </button>
        ) : <div />}

        <button type="submit" disabled={isSubmitting} className="bg-[#2B4560] text-white font-black py-5 px-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
          {currentStep === 3
            ? (isSubmitting ? 'กำลังบันทึก...' : '✅ บันทึกและรับ QR Code')
            : 'ถัดไป ➡'}
        </button>
      </div>
    </form>
  )
}

function QuestionItem({ q, index, handleAnswerChange }: any) {
  return (
    <div className="pb-8 border-b border-slate-50 last:border-0">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[#2B4560] font-black text-sm">{index + 1}</span>
        <p className="text-slate-700 font-bold text-lg leading-tight">{q.questionText}</p>
      </div>
      <div className="pl-12">
        {q.inputType === 'rating' ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score} className="relative cursor-pointer">
                  <input type="radio" name={`q-${q.id}`} className="peer sr-only" onChange={() => handleAnswerChange(q.id, score)} required />
                  <div className="w-10 h-10 rounded-lg border-2 border-slate-100 flex items-center justify-center text-slate-400 font-black peer-checked:bg-[#2B4560] peer-checked:text-white transition-all">{score}</div>
                </label>
              ))}
            </div>
            <input type="text" placeholder="หมายเหตุ" className="flex-1 min-w-[200px] p-2 border-b border-slate-200 outline-none text-sm" onChange={(e) => handleAnswerChange(q.id + 1000, e.target.value)} />
          </div>
        ) : (
          <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-[#2B4560]" placeholder="ระบุเพิ่มเติม..." onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
        )}
      </div>
    </div>
  )
}
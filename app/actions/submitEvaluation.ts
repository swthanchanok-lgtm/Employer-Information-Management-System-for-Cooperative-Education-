'use server'

import { PrismaClient } from '@prisma/client'

// ใช้ Global Prisma Instance เพื่อป้องกันปัญหา Connection เยอะเกินไปในโหมด Dev
const prisma = new PrismaClient()

// กำหนด Type ของข้อมูลที่จะรับเข้ามา
type AnswerInput = {
  question_id: number
  score: number | null
  answer_text: string | null
}

type SubmissionPayload = {
  formId: number
  evaluatorId: number
  studentId: number
  answers: AnswerInput[]
  // 🚩 1. เพิ่ม 2 บรรทัดนี้ให้ Typescript รู้จักลายเซ็น
  teacherSignature?: string | null
  mentorSignature?: string | null
}

export async function submitEvaluation(payload: SubmissionPayload) {
  try {
    console.log('Receiving submission:', payload)

    // บันทึกลง Database แบบ Transaction (ถ้าพัง ให้พังทั้งหมด ไม่บันทึกครึ่งๆ กลางๆ)
    const result = await prisma.evaluation.create({
      data: {
        formId: payload.formId,
        evaluatorId: payload.evaluatorId,
        studentId: payload.studentId,
        
        // 🚩 2. สั่งบันทึกลายเซ็นลง Database ด้วย
        teacherSignatureUrl: payload.teacherSignature,
        mentorSignatureUrl: payload.mentorSignature,
        
        // สร้างคำตอบลูกๆ (Nested Write)
        answers: {
          create: payload.answers.map((ans) => ({
            questionId: ans.question_id,    // แมพให้ตรงกับ Schema (CamelCase)
            score: ans.score,
            answerText: ans.answer_text,    // แมพให้ตรงกับ Schema (CamelCase)
          })),
        },
      },
    })

    // ถ้าผ่านฉลุย ส่งผลลัพธ์กลับไปบอกหน้าบ้าน
    return { success: true, data: result }

  } catch (error) {
    console.error('Error submitting evaluation:', error)
    return { success: false, message: 'Failed to save evaluation' }
  }
}
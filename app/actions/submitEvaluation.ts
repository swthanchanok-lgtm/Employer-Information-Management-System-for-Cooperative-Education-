'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type AnswerInput = {
  question_id: number
  score: number | null
  answer_text: string | null
}

type SubmissionPayload = {
  formId: number
  evaluatorId: number
  evaluatorName?: string | null     // 🚩 เพิ่ม: รับชื่ออาจารย์
  studentId: number
  establishmentId?: number | null   // 🚩 เพิ่ม: รับ ID บริษัท
  answers: AnswerInput[]
  teacherSignatureUrl?: string | null // 🚩 แก้ชื่อให้ตรงกับหน้าบ้าน (Url)
  mentorSignatureUrl?: string | null  // 🚩 แก้ชื่อให้ตรงกับหน้าบ้าน (Url)
  mentorName?: string | null          // 🚩 เพิ่ม: รับชื่อพี่เลี้ยง
}

export async function submitEvaluation(payload: SubmissionPayload) {
  try {
    const result = await prisma.evaluation.create({
      data: {
        formId: payload.formId,
        evaluatorId: payload.evaluatorId,
        evaluatorName: payload.evaluatorName, // 🚩 บันทึกชื่ออาจารย์ลงตารางเลย
        studentId: payload.studentId,
        establishmentId: payload.establishmentId, // 🚩 บันทึก ID บริษัท
        
        // 🚩 บันทึกลายเซ็น (ใช้ชื่อตัวแปรที่ส่งมาจากหน้าบ้าน)
        teacherSignatureUrl: payload.teacherSignatureUrl,
        mentorSignatureUrl: payload.mentorSignatureUrl,
        mentorName: payload.mentorName, // 🚩 บันทึกชื่อพี่เลี้ยง (ถึงไม่มี ID ก็เก็บชื่อไว้ได้)
        
        answers: {
          create: payload.answers.map((ans) => ({
            questionId: ans.question_id,
            score: ans.score,
            answerText: ans.answer_text,
          })),
        },
      },
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    return { success: false, message: 'Failed to save evaluation' }
  }
}
'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type AnswerInput = {
  question_id: number
  score: number | null
  answer_text: string | null
}

type EmployerSubmissionPayload = {
  formId: number
  studentId: number
  answers: AnswerInput[]
  // พี่เลี้ยงอาจจะไม่มี evaluatorId ในระบบนิเทศ เราเลยตัดออก หรือตั้งเป็น Optional
}

export async function submitEmployerEvaluation(payload: EmployerSubmissionPayload) {
  try {
    console.log('Receiving Employer submission:', payload)

    const result = await prisma.evaluation.create({
      data: {
        formId: payload.formId,
        studentId: payload.studentId,
        // 🚩 สำคัญ: ถ้าใน Schema ตาราง Evaluation ของแม่ 'evaluatorId' เป็น Required 
        // แม่ต้องหา ID สักอันมาใส่ (เช่น ID ของอาจารย์เจ้าของวิชา) 
        // หรือไปแก้ Schema ให้ evaluatorId เป็น Optional (ใส่อัญประกาศ ? หลังประเภทข้อมูล)
        
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
    console.error('Error submitting employer evaluation:', error)
    return { success: false, message: 'บันทึกข้อมูลพี่เลี้ยงไม่สำเร็จจ้า' }
  }
}
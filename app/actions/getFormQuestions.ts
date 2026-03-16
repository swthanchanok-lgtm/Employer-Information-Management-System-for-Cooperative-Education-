'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getFormQuestions(formId: number) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true } // ดึงคำถามลูกๆ ออกมาด้วย
    })
    return form
  } catch (error) {
    console.error("Error fetching form:", error)
    return null
  }
}
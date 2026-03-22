import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🚩 ต้องเป็น "export async function POST" เท่านั้น ห้ามมีคำว่า default นะจ๊ะ!
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 ใส่ Promise ครอบตรงนี้ด้วยนะจ๊ะ
) {
  try {
    // 🚩 จุดตายอยู่ตรงนี้จ้า! ต้องเติม await นำหน้า params
    const { id } = await params; 
    
    const body = await request.json();
    const { rating, comment } = body;

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment,
        establishment: {
          connect: { id: Number(id) }
        },
        user: {
          connect: { id: 1 } // อย่าลืมเช็คว่าใน DB มี User ID 1 ไหมนะจ๊ะ
        }
      },
      include: {
        user: true
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: "ส่งรีวิวไม่สำเร็จจ้า" }, { status: 500 });
  }
}
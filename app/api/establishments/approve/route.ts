import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  const { id, status } = await request.json(); // รับ ID และสถานะใหม่ (APPROVED/REJECTED)

  const updated = await prisma.establishment.update({
    where: { id: Number(id) },
    data: { status: status }
  });

  return NextResponse.json(updated);
}
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    //const session = await getServerSession(authOptions);
    // 🛡️ เช็คว่าเป็นอาจารย์ (INSTRUCTOR) หรือไม่
    //if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
      //return NextResponse.json({ error: "ไม่มีสิทธิ์ทำรายการนี้" }, { status: 403 });
    //}

    const { status } = await request.json(); // ส่งมาเป็น "APPROVED" หรือ "REJECTED"

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { status: status }
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: "อนุมัติไม่สำเร็จ" }, { status: 500 });
  }
}
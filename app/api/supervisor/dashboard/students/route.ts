export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = Number(session.user.id);

    const supervisionGroups = await prisma.supervisionGroup.findMany({
      where: {
        // 1. กรองเฉพาะกลุ่มที่อาจารย์คนนี้ดูแล
        instructors: {
          some: { id: teacherId }
        },
        // 🚩 2. [เพิ่มใหม่] กรองให้ดึงเฉพาะนักศึกษาที่เป็นปีปัจจุบันเท่านั้น!
        student: {
          academicYear: {
            isCurrent: true
          }
        }
      },
      include: {
        student: {
          include: {
            academicYear: true, // ดึงข้อมูลปีมาด้วยเผื่อใช้โชว์
            establishment: true,
            supervisionsReceived: {
              // 🚩 3. [เสริม] ถ้าต้องการนิเทศแค่ของปีนี้ 
              // ต้องระวังว่าถ้าไม่กรองวันที่ มันจะไปดึงประวัติเก่าของเด็กมาโชว์ว่า "นิเทศแล้ว"
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    const students = supervisionGroups
      .map((group) => group.student)
      .filter((student) => student !== null && student !== undefined);

    let supervisedCount = 0;

    const formattedStudents = students.map((std) => {
      const isSupervised = std.supervisionsReceived && std.supervisionsReceived.length > 0;
      if (isSupervised) supervisedCount++;

      return {
        id: std.id,
        firstName: std.name,
        lastName: std.surname || '',
        studentCode: std.username,
        major: std.department,
        companyName: std.establishment?.name || null,
        isSupervised: isSupervised,
        lastSupervisionDate: isSupervised ? std.supervisionsReceived[0].createdAt : null,
      };
    });

    const stats = {
      total: students.length,
      supervised: supervisedCount,
      evaluated: 0,
      pending: students.length - supervisedCount
    };

    return NextResponse.json({ stats, students: formattedStudents });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
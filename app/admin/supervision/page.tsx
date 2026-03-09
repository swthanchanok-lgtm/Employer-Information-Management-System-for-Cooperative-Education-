// 📂 app/admin/supervision/page.tsx
import { prisma } from "@/lib/prisma";
import SupervisionClient from "./SupervisionClient";

export default async function SupervisionPage() {
  // 1. ดึงรายชื่อนักศึกษาทั้งหมด (หรือเฉพาะคนที่ยังไม่มีอาจารย์นิเทศ)
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      supervisorId: true, // ตรวจสอบว่าใน Schema มีฟิลด์นี้ที่เชื่อมกับอาจารย์
    }
  });

  // 2. ดึงรายชื่ออาจารย์ทั้งหมดเพื่อทำ Dropdown ให้แอดมินเลือก
  const supervisors = await prisma.user.findMany({
    where: { role: "SUPERVISOR" },
    select: {
      id: true,
      name: true,
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">จัดการข้อมูลการนิเทศ</h1>
      <SupervisionClient students={students} supervisors={supervisors} />
    </div>
  );
}
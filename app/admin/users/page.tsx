// ไฟล์: app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import UserListClient from "./UserListClient";

export default async function UsersPage() {
  // ดึงข้อมูล User ทั้งหมดจากฐานข้อมูล (เอา role: 'asc' ออกไปแล้วจ้ะ)
  const users = await prisma.user.findMany({
    orderBy: [
      { department: 'asc' },
      { name: 'asc' }
    ],
  });

  return (
    <div className="p-6">
      <UserListClient initialUsers={users} />
    </div>
  );
}
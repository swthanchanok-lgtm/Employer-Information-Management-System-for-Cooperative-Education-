'use client'; // 🚩 ต้องมีบรรทัดนี้เพื่อให้ใช้ปุ่มกดและ router ได้

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import StudentProfileView from "../components/StudentProfileView";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. ระหว่างรอเช็ค Session ให้ขึ้น Loading สวยๆ
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2B4560] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#2B4560] font-bold animate-pulse">กำลังดึงข้อมูลโปรไฟล์...</p>
        </div>
      </div>
    );
  }

  // 2. ถ้าไม่ได้ Login ให้เด้งกลับหน้า Login
  if (!session) {
    router.push("/login");
    return null;
  }

  // 3. ส่งข้อมูลจริงไปที่ Component
  return (
    <StudentProfileView 
      currentUser={session.user} 
      onBack={() => router.push("/dashboard")} // 🚩 กดแล้วเด้งกลับหน้า Dashboard
      onLogout={() => {
        // 🚩 กดแล้วออกจากระบบและเด้งไปหน้า login
        signOut({ callbackUrl: "/login" });
      }} 
    />
  );
}
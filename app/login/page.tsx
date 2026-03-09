'use client'; 

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 👇 1. เพิ่มการ Import signIn จาก next-auth
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false, // เราจะจัดการเรื่องหน้าที่จะไปเอง
    });

    if (res?.error) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setIsLoading(false);
      return;
    }

    // ✅ หัวใจสำคัญอยู่ตรงนี้: ดึงข้อมูลล่าสุดว่าคนนี้เป็นใคร
    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();

    if (session?.user) {
      router.refresh(); // ล้างแคชชื่อเก่าออก

      // 🚩 เช็ค Role แล้วส่งไปให้ถูกที่
      const role = session.user.role;
      
      if (role === "ADMIN") {
        router.push('/admin/dashboard'); // ถ้าเป็น Admin ส่งไปหน้า Admin
      } else if (role === "TEACHER") {
        router.push('/teacher/dashboard'); // ถ้าเป็นอาจารย์ ส่งไปหน้าอาจารย์
      } else {
        router.push('/dashboard'); // ถ้าเป็นนักศึกษา ส่งไปหน้าปกติ
      }
    }

  } catch (err) {
    setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">เข้าสู่ระบบ</h1>
          <p className="text-gray-500 text-sm mt-2">ระบบจัดการฝึกงานและสหกิจศึกษา</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold shadow-md transition-all ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              นักศึกษายังไม่มีบัญชี? {' '}
              <Link 
                href="/register" 
                className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition"
              >
                ลงทะเบียนที่นี่
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
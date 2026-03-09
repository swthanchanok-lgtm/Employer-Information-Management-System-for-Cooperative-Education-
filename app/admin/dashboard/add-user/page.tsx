'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AddUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'STUDENT'; // รับค่า Role จาก URL

  // แปลง Role เป็นภาษาไทยเพื่อแสดงผล
  const roleLabel = role === 'TEACHER' ? 'อาจารย์นิเทศ' : role === 'ADMIN' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งาน';

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ส่งข้อมูลไปที่ API
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role }), // แนบ Role ไปด้วย
    });

    if (res.ok) {
      alert(`เพิ่ม ${roleLabel} เรียบร้อยแล้ว!`);
      router.push('/admin/dashboard'); // กลับไปหน้า Dashboard
    } else {
      const data = await res.json();
      alert(data.error || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          เพิ่มข้อมูล: {roleLabel}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
            <input
              type="text"
              required
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="เช่น อ.สมชาย ใจดี"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">สาขาวิชา / แผนก</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="ระบุสาขา"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username (สำหรับเข้าระบบ)</label>
            <input
              type="text"
              required
              className="mt-1 w-full p-2 border rounded-md"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border rounded-md"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-bold"
          >
            บันทึกข้อมูล
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
}
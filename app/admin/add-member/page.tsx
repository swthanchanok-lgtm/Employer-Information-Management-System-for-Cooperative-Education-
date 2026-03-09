'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, ArrowLeft, Save, User, 
  Mail, ShieldCheck, School, Briefcase 
} from 'lucide-react';

// 1. กำหนด Interface สำหรับ Props ของ CustomInput
interface CustomInputProps {
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void; // ระบุว่าฟังก์ชันนี้รับค่า string
}

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    name: '',
    email: '',
    department: 'วิศวกรรมคอมพิวเตอร์',
    role: 'STUDENT',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(`เพิ่ม ${formData.role} สำเร็จ!`);
        router.push('/admin/dashboard');
      } else {
        const error = await res.json();
        alert('เกิดข้อผิดพลาด: ' + error.message);
      }
    } catch (err) {
      alert('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-6 md:p-10 font-sans text-left">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1E293B] mb-6 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> กลับหน้าจัดการระบบ
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
          <div className="bg-[#1E293B] p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
                <UserPlus size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">เพิ่มสมาชิกเข้าระบบ</h1>
                <p className="text-indigo-200 text-xs mt-1 uppercase tracking-[0.2em] font-bold">User Management Console</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} /> ประเภทสมาชิก (User Role)
                  </label>
                  <select 
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <optgroup label="สายบริหารจัดการ">
                      <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                      <option value="COURSE_INSTRUCTOR">อาจารย์ประจำวิชา (COORDINATOR)</option>
                    </optgroup>
                    <optgroup label="สายวิชาการ / นิเทศ">
                      {/* 🚩 ใช้ SUPERVISOR ตามที่แก้ใน Prisma แล้ว */}
                      <option value="SUPERVISOR">อาจารย์ผู้นิเทศ (SUPERVISOR)</option>
                      <option value="STUDENT">นักศึกษา (STUDENT)</option>
                    </optgroup>
                  </select>
                </div>
                <div className="flex-1 w-full space-y-2">
                  <CustomInput 
                    label="สังกัด / สาขาวิชา" 
                    icon={<School size={18} />}
                    value={formData.department}
                    onChange={(v: string) => setFormData({...formData, department: v})} // ระบุ type v
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3 text-left">Credentials</h3>
                <CustomInput 
                  label="Username / รหัสนักศึกษา" 
                  icon={<User size={18} />}
                  placeholder="admin_staff / 66xxxxxxx"
                  value={formData.username}
                  onChange={(v: string) => setFormData({...formData, username: v})}
                />
                <CustomInput 
                  label="รหัสผ่านชั่วคราว" 
                  icon={<ShieldCheck size={18} />}
                  type="password"
                  placeholder="กำหนดรหัสผ่าน"
                  value={formData.password}
                  onChange={(v: string) => setFormData({...formData, password: v})}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3 text-left">Profile Details</h3>
                <CustomInput 
                  label="ชื่อ-นามสกุล" 
                  icon={<User size={18} />}
                  placeholder="ระบุชื่อจริง-นามสกุล"
                  value={formData.name}
                  onChange={(v: string) => setFormData({...formData, name: v})}
                />
                <CustomInput 
                  label="อีเมลติดต่อ" 
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="name@university.ac.th"
                  value={formData.email}
                  onChange={(v: string) => setFormData({...formData, email: v})}
                />
              </div>

            </div>

            <div className="mt-12 flex items-center justify-end gap-4 border-t pt-8">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                disabled={loading}
                className={`px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all ${
                  loading ? 'bg-slate-400' : 'bg-[#1E293B] hover:bg-indigo-600 text-white active:scale-95'
                }`}
              >
                {loading ? 'กำลังประมวลผล...' : <><Save size={18} /> ยืนยันเพิ่มสมาชิก</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🚩 ปรับจูน CustomInput ให้รองรับ Types
function CustomInput({ label, icon, placeholder, type = "text", value, onChange }: CustomInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full bg-white border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
        />
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus, ArrowLeft, Save, User,
  Mail, ShieldCheck, School, Briefcase, ChevronDown, Award
} from 'lucide-react';

// ... (Interface CustomInputProps เหมือนเดิมจ้า)
interface CustomInputProps {
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean; // เพิ่ม optional required
}

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    prefix: '',
    name: '',
    surname: '',
    tel: '',
    email: '',
    department: '',
    faculty: '',
    role: 'STUDENT',
    academicRank: '', // วิทยฐานะ
    personnelType: '',
    position: '',    // ตำแหน่งบริหาร
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/create', {
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

              {/* ส่วนบน: Role และสังกัด */}
              <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} /> ประเภทสมาชิก (User Role)
                  </label>
                  <select
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <optgroup label="สายบริหารจัดการ">
                      <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                      <option value="COURSE_INSTRUCTOR">อาจารย์ประจำวิชา (COORDINATOR)</option>
                    </optgroup>
                    <optgroup label="สายวิชาการ / นิเทศ">
                      <option value="SUPERVISOR">อาจารย์ผู้นิเทศ (SUPERVISOR)</option>
                      <option value="STUDENT">นักศึกษา (STUDENT)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <School size={12} /> คณะ
                  </label>
                  <select
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    required
                  >
                    <option value="" disabled>--- เลือกคณะ ---</option>
                    {FACULTY.map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <School size={12} /> สังกัด / สาขาวิชา
                  </label>
                  <select
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="" disabled>--- เลือกสาขาวิชา ---</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ฝั่งซ้าย: Credentials & Identity */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Account Information</h3>

                <CustomInput
                  label="Username / รหัสนักศึกษา"
                  icon={<User size={18} />}
                  placeholder="admin_staff / 66xxxxxxx"
                  value={formData.username}
                  onChange={(v) => setFormData({ ...formData, username: v })}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ชื่อจริง (และคำนำหน้า)</label>
                  <div className="flex gap-3">
                    <div className="w-1/3 relative group">
                      <select
                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                        value={formData.prefix}
                        onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                        required
                      >
                        <option value="">คำนำหน้า</option>
                        <option value="นาย">นาย</option>
                        <option value="นางสาว">นางสาว</option>
                        <option value="นาง">นาง</option>
                        {formData.role !== 'STUDENT' && (
                          <>
                            <option value="อาจารย์">อาจารย์</option>
                            <option value="ดร.">ดร.</option>
                            <option value="ผศ.">ผศ.</option>
                            <option value="รศ.">รศ.</option>
                            <option value="ศ.">ศ.</option>
                          </>
                        )}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="w-2/3">
                      <input
                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                        placeholder="ระบุชื่อจริง"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <CustomInput
                  label="นามสกุล"
                  icon={<User size={18} />}
                  placeholder="ระบุนามสกุล"
                  value={formData.surname}
                  onChange={(v) => setFormData({ ...formData, surname: v })}
                />
              </div>

              {/* ฝั่งขวา: Profile & Contact */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Personal Details</h3>

                <CustomInput
                  label="อีเมลติดต่อ"
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="name@university.ac.th"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                />

                {/* 🚩 โซนเฉพาะ "อาจารย์/ADMIN" - ปรับวิทยฐานะไม่บังคับ */}
                {formData.role !== 'STUDENT' && (
                  <div className="space-y-6">
                    <CustomInput
                      label="วิทยฐานะ (ถ้ามี)"
                      icon={<Award size={18} />}
                      placeholder="เช่น ผศ., รศ. (เว้นว่างได้)"
                      value={formData.academicRank}
                      onChange={(v) => setFormData({ ...formData, academicRank: v })}
                      required={false} // ✅ ไม่บังคับกรอกแล้วจ้าแม่
                    />

                    <CustomInput
                      label="ตำแหน่งบริหาร"
                      icon={<ShieldCheck size={18} />}
                      placeholder="เช่น หัวหน้าสาขา, รองคณบดี"
                      value={formData.position || ''}
                      onChange={(v) => setFormData({ ...formData, position: v })}
                      required={false} // ✅ ไม่บังคับกรอกเหมือนกันจ้า
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ปุ่มกดยืนยัน */}
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
                className={`px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all ${loading ? 'bg-slate-400' : 'bg-[#1E293B] hover:bg-indigo-600 text-white active:scale-95'
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

function CustomInput({ label, icon, placeholder, type = "text", value, onChange, required = true }: CustomInputProps) {
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
          required={required} // ใช้ค่าที่ส่งมา
          className="w-full bg-white border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
        />
      </div>
    </div>
  );
}

const DEPARTMENTS = [
  "สาขาวิชาวิศวกรรมเครื่องจักรกลเกษตร",
  "สาขาวิชาวิศวกรรมคอมพิวเตอร์",
  "สาขาวิชาวิศวกรรมอุตสาหการ",
  "สาขาวิชาวิศวกรรมโลจิสติกส์",
  "สาขาวิชาเทคโนโลยีอุตสาหกรรม",
  "สาขาวิชานวัตกรรมการออกแบบและสถาปัตยกรรม"
];

const FACULTY = [
  "คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม"
];
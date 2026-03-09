'use client';

import React from 'react';
import { LogOut, ArrowLeft, School, User as UserIcon, Building2, BadgeCheck, Mail, Phone, Calendar } from 'lucide-react';

interface StudentProfileViewProps {
  currentUser: any; // รับข้อมูล User จาก Session
  onBack: () => void;
  onLogout: () => void;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ currentUser, onBack, onLogout }) => {
  
  // เตรียมข้อมูลจาก currentUser (ข้อมูลจริงจาก DB)
  const userData = {
    name: currentUser?.name || "ไม่ระบุชื่อ",
    studentId: currentUser?.username || "ไม่ระบุรหัส", // ปกติ username คือรหัสนักศึกษา
    email: currentUser?.email || "ไม่มีข้อมูลอีเมล",
    department: currentUser?.department || "ไม่ระบุสาขาวิชา",
    role: currentUser?.role || "STUDENT",
    avatar: currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`,
    // ส่วนนี้ถ้าใน DB ยังไม่มี ให้ใส่เป็น "รอระบุ" ไว้ก่อน
    phone: currentUser?.phone || "ยังไม่ได้ระบุเบอร์โทร",
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      
      {/* 🔷 Navigation Bar */}
      <nav className="h-16 bg-[#2B4560] shadow-lg flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onBack}>
          <div className="bg-white p-1 rounded-md text-[#2B4560]">
            <Building2 size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-none">CO-EMS</span>
            <span className="text-[8px] text-white/70 font-bold uppercase tracking-widest mt-0.5">Student System</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/80 hover:text-white flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft size={18} /> กลับหน้าหลัก
          </button>
          <div className="h-4 w-px bg-white/20 mx-2"></div>
          <button onClick={onLogout} className="text-white/80 hover:text-red-300 flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 hover:bg-white/10 rounded-lg">
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* 🔷 Main Profile Container */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* Header/Banner Section */}
          <div className="h-32 bg-gradient-to-r from-[#2B4560] to-[#536B86] relative">
            <div className="absolute -bottom-16 left-12 flex items-end gap-8">
              <div className="size-40 rounded-2xl border-4 border-white overflow-hidden shadow-xl bg-slate-100">
                <img src={userData.avatar} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="pb-4">
                <h1 className="text-3xl font-black text-[#2B4560] tracking-tight">{userData.name}</h1>
                <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <BadgeCheck size={18} className="text-blue-500" />
                  รหัสนักศึกษา: {userData.studentId}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 px-12 pb-16">
            
            {/* 🟦 Section 1: ข้อมูลทางวิชาการ (ดึงจาก DB จริง) */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100">
                <School className="text-[#2B4560]" size={20} />
                <h3 className="text-sm font-black text-[#2B4560] uppercase tracking-[0.2em]">ข้อมูลทางวิชาการ (Academic)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <OfficialField label="สาขาวิชา / ภาควิชา" value={userData.department} />
                <OfficialField label="สถานะการเป็นนักศึกษา" value="ปกติ" />
                <OfficialField label="ประเภทผู้ใช้" value={userData.role} />
              </div>
            </section>

            {/* 🟦 Section 2: ข้อมูลส่วนตัว (ดึงจาก DB จริง) */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100">
                <UserIcon className="text-[#2B4560]" size={20} />
                <h3 className="text-sm font-black text-[#2B4560] uppercase tracking-[0.2em]">ข้อมูลส่วนบุคคล (Personal)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InputField label="ชื่อ-นามสกุล" value={userData.name} icon={<UserIcon size={16}/>} />
                <InputField label="อีเมลมหาวิทยาลัย" value={userData.email} icon={<Mail size={16}/>} />
                <InputField label="เบอร์โทรศัพท์ติดต่อ" value={userData.phone} icon={<Phone size={16}/>} />
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

/* 🔷 Components ย่อยสำหรับความสะอาด */
const OfficialField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);

const InputField: React.FC<{ label: string; value: string; icon: any }> = ({ label, value, icon }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">{label}</label>
    <div className="relative flex items-center">
      <div className="absolute left-3 text-slate-400">
        {icon}
      </div>
      <input 
        type="text" 
        readOnly
        value={value}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none"
      />
    </div>
  </div>
);

export default StudentProfileView;
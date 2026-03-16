'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, UserPlus, Building2, 
  ChevronRight, LayoutDashboard, UserCheck,
  CheckCircle2, Bell, Settings2
} from 'lucide-react';


interface DashboardProps {
  session: any;
  stats: {
    totalStudents: number;
    totalSupervisors: number;
    totalEstablishments: number;
    totalPendingJobs: number;
  };
  pendingRequests: any[]; 
  pendingJobs: any[];     
}

export default function AdminDashboardClient({ session, stats }: DashboardProps) {

  const [currentTerm, setCurrentTerm] = useState<any>(null);

useEffect(() => {
  fetch('/api/academic-years/current')
    .then(res => res.json())
    .then(data => {
      if (data && !data.error) {
        setCurrentTerm(data);
      }
    })
    .catch(err => console.error("โหลดปีการศึกษาไม่ขึ้นจ้าแม่:", err));
}, []);
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* 🛡️ Header ส่วนหัว Admin Dashboard - ฉบับปรับปรุงใหม่ให้แม่รณชัย */}
<header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div>
    <div className="flex items-center gap-2 text-[#2B4560] mb-1">
      <LayoutDashboard size={20} />
      <span className="text-xs font-black uppercase tracking-[0.2em]">Management System</span>
    </div>
    
    {/* 🚀 Title ใหญ่ พร้อมปีการศึกษาที่เป็นเนื้อเดียวกัน */}
    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
      Admin Dashboard
      {currentTerm && (
        <span className="text-2xl font-medium text-slate-300 border-l-2 border-slate-200 pl-4 ml-1">
          ปีการศึกษา {currentTerm.year}/{currentTerm.semester}
        </span>
      )}
    </h1>
    
    {/* ✅ สวัสดีคุณ... ที่แม่รัก ยังอยู่ครบจ้า */}
    <p className="text-slate-500 text-sm font-medium mt-1">
      สวัสดีคุณ <span className="text-[#2B4560] font-bold">{session?.user?.name || "ผู้ดูแลระบบ"}</span> • จัดการระบบสมาชิก Coop-EMS
    </p>
  </div>
  
  {/* 👤 ส่วนโปรไฟล์ขวามือ (เก็บไว้ครบตามโค้ดเดิมแม่จ้า) */}
  <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pr-6">
    <div className="w-10 h-10 bg-[#2B4560] rounded-xl flex items-center justify-center text-white font-bold shadow-inner">
      {session?.user?.name?.[0] || "A"}
    </div>
    <div>
      <p className="text-sm font-bold text-slate-800 leading-none">Administrator</p>
      <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{session?.user?.email}</p>
    </div>
  </div>
</header>
        {/* 🚩 1. The Power Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label="นักศึกษาทั้งหมด" value={stats.totalStudents} unit="คน" sub="ลงทะเบียนในระบบ" color="blue" icon={<Users size={22}/>} />
          <StatCard label="อาจารย์นิเทศ" value={stats.totalSupervisors} unit="ท่าน" sub="ผู้ดูแลนักศึกษา" color="indigo" icon={<UserCheck size={22}/>} />
          <StatCard label="สถานประกอบการ" value={stats.totalEstablishments} unit="แห่ง" sub="ฐานข้อมูลปัจจุบัน" color="orange" icon={<Building2 size={22}/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ส่วนเนื้อหาหลัก: ตอนนี้ Admin เน้นดูภาพรวมสมาชิก */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm text-center">
               <div className="max-w-sm mx-auto">
                  <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <UserCheck className="text-slate-300" size={40} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 mb-2">ยินดีต้อนรับสู่ส่วนจัดการระบบ</h2>
                  <p className="text-slate-500 text-sm font-medium">
                    คุณสามารถจัดการบัญชีผู้ใช้งาน เพิ่มสมาชิกใหม่ หรือตรวจสอบรายชื่ออาจารย์และนักศึกษาได้จากเมนูด้านข้างค่ะ
                  </p>
               </div>
            </section>
          </div>

          <aside className="space-y-6 text-left">
            {/* 🚩 2. User Management: ส่วนจัดการสมาชิก (เหลือแค่อันนี้ตามสั่งจ้า) */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Users size={16} /> User Management
              </h3>
              <div className="space-y-4">
                <MenuLink href="/admin/add-member" icon={<UserPlus size={20}/>} label="เพิ่มสมาชิกใหม่" sub="Create Staff Account" color="blue" />
                <MenuLink href="/admin/users" icon={<UserCheck size={20}/>} label="รายชื่อสมาชิก" sub="Manage All Users" color="indigo" />
              </div>
            </div>

            {/* ส่วนเสริม: System Status */}
            <div className="p-6 bg-[#2B4560] rounded-[2rem] text-white shadow-xl shadow-[#2B4560]/10 overflow-hidden relative group">
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">System Status</p>
                    <p className="text-lg font-black mb-4">ระบบทำงานปกติ</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-400"></div>
                    </div>
                </div>
                <LayoutDashboard size={100} className="absolute -bottom-4 -right-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---
function StatCard({ label, value, unit, sub, color, icon }: any) {
  const themes: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100"
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${themes[color] || themes.blue}`}>{icon}</div>
      </div>
      <div className="z-10 relative text-left">
        <p className="text-3xl font-black text-slate-900 leading-none mb-2 tracking-tighter">
          {value} <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{unit}</span>
        </p>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{label}</h3>
        <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${themes[color]?.split(' ')[0]}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</span>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label, sub, color }: any) {
  const hoverColors: any = {
    blue: "group-hover:bg-blue-600",
    indigo: "group-hover:bg-indigo-600",
  };
  
  return (
    <Link href={href} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-slate-100 transition-all group bg-white">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-slate-50 text-slate-300 rounded-2xl transition-all duration-300 group-hover:text-white group-hover:shadow-lg ${hoverColors[color] || 'group-hover:bg-slate-600'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-[#2B4560] transition-colors">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{sub}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200 group-hover:text-[#2B4560] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
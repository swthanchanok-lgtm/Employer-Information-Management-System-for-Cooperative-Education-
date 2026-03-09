'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, UserPlus, Building2, 
  ChevronRight, LayoutDashboard, UserCheck,
  Clock, CheckCircle2, Briefcase, Bell,
  PlusCircle, Settings2
} from 'lucide-react';

// ✅ Interface รองรับข้อมูลครบถ้วน
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

export default function AdminDashboardClient({ session, stats, pendingRequests, pendingJobs }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Header ส่วนหัว */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2B4560] mb-1">
              <LayoutDashboard size={20} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Management System</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium">
              สวัสดีคุณ {session?.user?.name || "ผู้ดูแลระบบ"} • จัดการระบบ Coop-EMS
            </p>
          </div>
          
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pr-6">
            <div className="w-10 h-10 bg-[#2B4560] rounded-xl flex items-center justify-center text-white font-bold shadow-inner">
              {session?.user?.name?.[0] || "A"}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Administrator</p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{session?.user?.email}</p>
            </div>
          </div>
        </header>

        {/* 🚩 1. The Power Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="นักศึกษาทั้งหมด" value={stats.totalStudents} unit="คน" sub="ลงทะเบียนในระบบ" color="blue" icon={<Users size={22}/>} />
          <StatCard label="อาจารย์นิเทศ" value={stats.totalSupervisors} unit="ท่าน" sub="ผู้ดูแลนักศึกษา" color="indigo" icon={<UserCheck size={22}/>} />
          <StatCard label="สถานประกอบการ" value={stats.totalEstablishments} unit="แห่ง" sub="ที่ผ่านการอนุมัติ" color="orange" icon={<Building2 size={22}/>} />
          <StatCard label="งานรออนุมัติ" value={stats.totalPendingJobs} unit="ตำแหน่ง" sub="ต้องตรวจสอบ" color="rose" icon={<Bell size={22}/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* 🚩 2. คำร้องเพิ่มบริษัทใหม่ */}
            <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden text-left">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg">คำร้องเพิ่มบริษัทใหม่</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Establishment Pending</p>
                  </div>
                </div>
                <span className="bg-[#2B4560] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-[#2B4560]/10">
                  {pendingRequests?.length || 0} รายการ
                </span>
              </div>
              
              <div className="divide-y divide-slate-50">
                {pendingRequests && pendingRequests.length > 0 ? (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#2B4560] transition-colors shadow-sm">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-800 leading-tight group-hover:text-[#2B4560] transition-colors">
                            {req.name || req.companyName}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            เสนอโดย: <span className="text-slate-600 font-bold">{req.studentName || req.student?.name || "ไม่ระบุชื่อ"}</span>
                          </p>
                        </div>
                      </div>
                      <Link 
                        href={`/admin/establishments/verify/${req.id}`}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#2B4560] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all active:scale-95"
                      >
                        ตรวจสอบข้อมูล
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-14 text-center">
                    <CheckCircle2 size={32} className="text-slate-100 mx-auto mb-2" />
                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">ไม่มีบริษัทค้างตรวจสอบ</p>
                  </div>
                )}
              </div>
            </section>

            {/* 🚩 3. คำร้องเพิ่มตำแหน่งงานใหม่ */}
            <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden text-left">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg">คำร้องเพิ่มตำแหน่งงาน</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Job Position Pending</p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full">
                  {pendingJobs?.length || 0} รายการ
                </span>
              </div>
              
              <div className="divide-y divide-slate-50">
                {pendingJobs && pendingJobs.length > 0 ? (
                  pendingJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-blue-50/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-800 leading-tight">
                            {job.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            บริษัท: <span className="text-slate-600 font-bold">{job.establishment?.name}</span>
                          </p>
                        </div>
                      </div>
                      <Link 
                        href="/admin/approve-jobs"
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        อนุมัติงาน
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-14 text-center">
                    <CheckCircle2 size={32} className="text-slate-100 mx-auto mb-2" />
                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">ไม่มีงานค้างตรวจสอบ</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6 text-left">
            {/* 🚩 4. Management Tools: เพิ่มส่วนจัดการข้อมูลหลัก */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Settings2 size={16} /> Data Management
              </h3>
              <div className="space-y-4">
                {/* ➕ เพิ่มสถานประกอบการโดย Admin */}
                <MenuLink 
                  href="/admin/establishments/add" 
                  icon={<PlusCircle size={20}/>} 
                  label="เพิ่มสถานประกอบการ" 
                  sub="Add New Company" 
                  color="orange" 
                />
                {/* 💼 จัดการตำแหน่งงานทั้งหมด */}
                <MenuLink 
                  href="/admin/jobs/manage" 
                  icon={<Briefcase size={20}/>} 
                  label="จัดการตำแหน่งงาน" 
                  sub="Edit / Delete All Jobs" 
                  color="blue" 
                />
              </div>
            </div>

            {/* 🚩 5. User Management: ส่วนจัดการสมาชิก */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Users size={16} /> User Management
              </h3>
              <div className="space-y-4">
                <MenuLink href="/admin/add-member" icon={<UserPlus size={20}/>} label="เพิ่มสมาชิกใหม่" sub="Create Staff Account" color="blue" />
                <MenuLink href="/admin/users" icon={<UserCheck size={20}/>} label="รายชื่อสมาชิก" sub="Manage All Users" color="indigo" />
              </div>
            </div>

            {/* ส่วนเสริม: ข้อมูลระบบเบื้องต้น */}
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
    orange: "group-hover:bg-orange-600",
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
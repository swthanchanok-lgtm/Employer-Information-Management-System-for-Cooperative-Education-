'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Bell, LogOut, User, MapPin,
  Briefcase, Calendar, ChevronRight, ArrowLeft,
  Building2, FileText, CalendarDays, ArrowRight,
  GraduationCap, ChevronDown, Clock, CheckCircle2, XCircle, AlertCircle, PlusCircle, Banknote, Sparkles
} from 'lucide-react';

export function DashboardClient({
  initialJobs = [], 
  initialEstablishments = [], // 👈 เพิ่มบรรทัดนี้จ้า!
  currentUser,
  application
}: {
  initialJobs?: any[],
  initialEstablishments?: any[], // 👈 และเพิ่มตรง Type นี้ด้วยจ้าแม่!
  currentUser?: any,
  application?: any
}) {
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  const [view, setView] = useState<'HOME' | 'LIST'>('HOME');
  
 
  const internshipStatus = application?.status || currentUser?.approvalStatus || "NOT_SUBMITTED";

  useEffect(() => {
    fetch('/api/academic-years/current')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setCurrentTerm(data);
      })
      .catch(err => console.error("โหลดปีการศึกษาไม่ขึ้นจ้า:", err));
  }, []);

  const user = {
    name: currentUser?.name || "ผู้ใช้งาน",
    avatar: currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=2B4560&color=fff`,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200",
          icon: <Clock size={40} className="text-amber-500 animate-pulse" />,
          title: "กำลังรออาจารย์อนุมัติ ⏳", desc: "คำร้องของคุณถูกส่งไปยังอาจารย์ประจำวิชาแล้ว",
          badge: "อยู่ระหว่างพิจารณา", showSearchButton: false
        };
      case "APPROVED":
        return {
          color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
          icon: <CheckCircle2 size={40} className="text-emerald-500" />,
          title: "อนุมัติการฝึกงานแล้ว! 🎉", desc: "ยินดีด้วย! เตรียมตัวเข้าฝึกงานได้เลยจ้า",
          badge: "ผ่านการอนุมัติ", showSearchButton: false
        };
      case "REJECTED":
        return {
          color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200",
          icon: <XCircle size={40} className="text-rose-500" />,
          title: "คำร้องไม่ผ่านการอนุมัติ ❌", desc: "กรุณาหาที่ฝึกงานและยื่นคำร้องใหม่นะจ๊ะ",
          badge: "ไม่ผ่านการอนุมัติ", showSearchButton: true
        };
      default:
        return {
          color: "text-slate-400", bg: "bg-white", border: "border-slate-200",
          icon: <AlertCircle size={40} className="text-slate-300" />,
          title: "พร้อมเริ่มฝึกงานหรือยัง?", desc: "เลือกตำแหน่งงานที่สนใจเพื่อยื่นขออนุมัติได้เลย",
          badge: "ยังไม่ได้ดำเนินการ", showSearchButton: true
        };
    }
  };

  const status = getStatusConfig(internshipStatus);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-600 text-left transition-all">
      {/* Navbar แบบเรียบหรู */}
      <nav className="h-20 bg-white border-b border-slate-100 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="bg-[#2B4560] p-2 rounded-xl text-white shadow-lg shadow-blue-900/10">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-black text-[#2B4560] tracking-tighter">CO-EMS</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">{user.name}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#2B4560] tracking-tight mb-2">
              ยินดีต้อนรับ {user.name.split(' ')[0]} <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                Student Dashboard Overview <Sparkles size={12} className="text-amber-400" />
            </p>
          </div>
          {currentTerm && (
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-sm font-black text-blue-600 tracking-normal italic">
                    Semester {currentTerm.semester}/{currentTerm.year}
                </span>
            </div>
          )}
        </div>

        {view === 'HOME' && (
          <div className="animate-in fade-in duration-700 space-y-8">

            {/* Banner สถานะหลัก */}
            <div className={`w-full ${status.bg} border-2 ${status.border} rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden`}>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 z-10">
                {status.icon}
              </div>

              <div className="flex-1 text-center md:text-left z-10">
                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-white border ${status.color}`}>
                  {status.badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[#2B4560] mb-3 leading-tight">{status.title}</h2>
                <p className="text-slate-500 font-bold max-w-xl text-base md:text-lg opacity-80">{status.desc}</p>
              </div>

              <div className="flex flex-col gap-3 min-w-[240px] w-full md:w-auto z-10">
                {status.showSearchButton && (
                  <button
                    onClick={() => setView('LIST')}
                    className="w-full py-5 bg-[#2B4560] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    ดูตำแหน่งงานทั้งหมด
                  </button>
                )}
                <button className="w-full py-5 bg-white text-slate-400 border border-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                  ประวัติการยื่นคำร้อง
                </button>
              </div>
            </div>

            {/* โชว์ตำแหน่งงานที่ยื่นไปแล้ว (ถ้ามี) */}
            {['PENDING', 'APPROVED'].includes(internshipStatus) && application && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-inner">
                  <img
                    src={application.establishment?.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
                    alt="Company" className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-3 italic">
                    {internshipStatus === 'PENDING' ? '📍 กำลังพิจารณาตำแหน่ง' : '✨ ตำแหน่งงานปัจจุบันของคุณ'}
                  </p>
                  <h3 className="text-2xl font-black text-[#2B4560] mb-2">{application.job?.title}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <Building2 size={18} className="text-slate-300" /> {application.establishment?.name}
                      </p>
                      <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                        <MapPin size={18} className="text-rose-400" /> {application.establishment?.address?.split(' ')[0]}
                      </p>
                  </div>
                </div>
                <Link href={`/student/jobs/${application.job?.id}`}>
                    <button className="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                        ดูรายละเอียดงาน
                    </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {view === 'LIST' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 text-left">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2B4560] transition-colors">
                    <ArrowLeft size={16} /> กลับหน้าหลัก
                </button>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="ค้นหาตำแหน่งงานที่สนใจ..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialJobs.length > 0 ? (
                initialJobs.map((job: any) => (
                  <JobCard key={job.id} job={job} establishment={job.establishment} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">ยังไม่มีตำแหน่งงานที่เปิดรับจ้าแม่</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


const JobCard = ({ job, establishment }: any) => (
  <div className="group bg-white rounded-[2.8rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden text-left relative">
    
    {/* Highlight Tag */}
    {job.salary > 15000 && (
        <div className="absolute top-6 left-6 z-10">
            <span className="bg-amber-400 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-200">
                High Salary
            </span>
        </div>
    )}

    <div className="p-8 flex-1">
      <div className="flex justify-between items-start mb-6 pt-4">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-[#2B4560] leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-400 font-bold flex items-center gap-1.5 text-xs uppercase tracking-tight">
            <Building2 size={14} className="text-blue-400" /> {establishment?.name || "ไม่ระบุบริษัท"}
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl border border-slate-50 overflow-hidden shadow-inner flex-shrink-0 bg-slate-50">
          <img
            src={establishment?.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            alt="company"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        <div className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-3 rounded-2xl flex items-center gap-3 border border-slate-100/50">
          <Banknote size={16} className="text-emerald-500" /> 
          <span>{job.salary > 0 ? `฿${job.salary.toLocaleString()} / เดือน` : "เงินเดือนตามตกลง"}</span>
        </div>
        <div className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-3 rounded-2xl flex items-center gap-3 border border-slate-100/50">
          <MapPin size={16} className="text-rose-500" /> 
          <span>{establishment?.address?.split(' ')[0] || "ไม่ระบุจังหวัด"}</span>
        </div>
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="px-8 pb-8 flex gap-3">
      <Link href={`/student/jobs/${job.id}`} className="flex-1">
        <button className="w-full py-4.5 bg-[#2B4560] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
          รายละเอียดงาน
        </button>
      </Link>
      <Link href={`/student/establishments/${establishment?.id}`}>
        <button className="w-14 h-14 bg-white text-slate-300 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:text-blue-500 transition-all border border-slate-100 shadow-sm" title="ดูข้อมูลบริษัท">
          <Building2 size={20} />
        </button>
      </Link>
    </div>
  </div>
);
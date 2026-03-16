'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Bell, LogOut, User, MapPin,
  Briefcase, Calendar, ChevronRight, ArrowLeft,
  Building2, FileText, CalendarDays, ArrowRight,
  GraduationCap, ChevronDown, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

export default function SearchEstablishmentPage() {
  // 🚩 1. สร้าง State สำหรับเก็บคำค้นหา (ค่าเริ่มต้นเป็นค่าว่าง)
  const [searchTerm, setSearchTerm] = useState('');

  // สมมติว่านี่คือข้อมูลทั้งหมดที่แม่ดึงมาจาก API (แม่น่าจะมี State ตัวนี้อยู่แล้ว)
  const [allData, setAllData] = useState([
    { id: 1, companyName: "Thaicom", jobTitle: "Software Engineer" },
    { id: 2, companyName: "Google", jobTitle: "Data Scientist" },
    { id: 3, companyName: "Agoda", jobTitle: "Software Tester" },
  ]);
}

export function DashboardClient({
  initialEstablishments = [],
  initialJobs = [],
  currentUser,
  application
}: {
  initialEstablishments?: any[],
  initialJobs?: any[],
  currentUser?: any,
  application?: any
}) {
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🚩 สถานะการยื่นคำร้อง (ดึงจาก currentUser)
  const internshipStatus = application?.status || currentUser?.approvalStatus || "NOT_SUBMITTED";

  useEffect(() => {
    fetch('/api/academic-years/current')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setCurrentTerm(data);
      })
      .catch(err => console.error("โหลดปีการศึกษาไม่ขึ้นจ้า:", err));
  }, []);

  const [view, setView] = useState<'HOME' | 'LIST'>('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = {
    name: currentUser?.name || "ผู้ใช้งาน",
    avatar: currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=2B4560&color=fff`,
  };

  // 🎨 ตั้งค่า UI ตามสถานะ
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: <Clock size={40} className="text-amber-500 animate-pulse" />,
          title: "กำลังรออาจารย์อนุมัติ ⏳",
          desc: "คำร้องของคุณถูกส่งไปยังอาจารย์ประจำวิชาแล้ว กรุณารอการตรวจสอบ",
          badge: "อยู่ระหว่างพิจารณา",
          showSearchButton: false
        };
      case "APPROVED":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <CheckCircle2 size={40} className="text-emerald-500" />,
          title: "อนุมัติการฝึกงานแล้ว! 🎉",
          desc: "ยินดีด้วย! คุณได้รับการอนุมัติให้เข้าฝึกงานในสถานประกอบการนี้แล้ว",
          badge: "ผ่านการอนุมัติ",
          showSearchButton: false
        };
      case "REJECTED":
        return {
          color: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-200",
          icon: <XCircle size={40} className="text-rose-500" />,
          title: "คำร้องไม่ผ่านการอนุมัติ ❌",
          desc: "คำร้องล่าสุดของคุณไม่ผ่านการอนุมัติ กรุณาหาที่ฝึกงานและยื่นคำร้องใหม่จ้า",
          badge: "ไม่ผ่านการอนุมัติ",
          showSearchButton: true
        };
      default:
        return {
          color: "text-slate-400",
          bg: "bg-white",
          border: "border-slate-200",
          icon: <AlertCircle size={40} className="text-slate-300" />,
          title: "คุณยังไม่ได้ยื่นขอฝึกงาน",
          desc: "กรุณาเลือกสถานประกอบการและตำแหน่งงานที่สนใจเพื่อยื่นขออนุมัติ",
          badge: "ยังไม่ได้ดำเนินการ",
          showSearchButton: true
        };
    }
  };

  const status = getStatusConfig(internshipStatus);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-600 text-left">
      {/* Navbar */}
      <nav className="h-20 bg-white border-b border-slate-100 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="bg-[#2B4560] p-1.5 rounded-lg text-white">
            <Building2 size={24} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2B4560] tracking-tight mb-2">
              สวัสดีคุณ {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Dashboard Status Overview</p>
          </div>
          {currentTerm && (
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-50 text-sm font-black text-[#2B4560]">
              ปีการศึกษา {currentTerm.semester}/{currentTerm.year}
            </div>
          )}
          <Link href="/establishments/add">
            <button className="w-full py-4 bg-[#2B4560] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Building2 size={16} />
              เพิ่มสถานประกอบการใหม่
            </button>
          </Link>
        </div>

        {view === 'HOME' && (
          <div className="animate-in fade-in duration-700">

            {/* 1. Banner สถานะ */}
            <div className={`w-full ${status.bg} border-2 ${status.border} rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden mb-8`}>
              <div className="absolute -right-10 -bottom-10 opacity-5 text-[#2B4560]">
                <FileText size={200} />
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-inner z-10">
                {status.icon}
              </div>

              <div className="flex-1 text-center md:text-left z-10">
                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-white border ${status.color}`}>
                  {status.badge}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#2B4560] mb-2">{status.title}</h2>
                <p className="text-slate-500 font-bold max-w-xl text-sm md:text-base">{status.desc}</p>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto z-10">
                {/* ปุ่มค้นหาที่ฝึกงานใหม่ โชว์เฉพาะตอนยังไม่ยื่น หรือ นก */}
                {status.showSearchButton && (
                  <button
                    onClick={() => setView('LIST')}
                    className="w-full py-4 bg-[#2B4560] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
                  >
                    ค้นหาที่ฝึกงานใหม่
                  </button>
                )}

                <button className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                  ดูรายละเอียดคำร้อง
                </button>
              </div>
            </div>

            {/* 2. ส่วนโชว์ข้อมูลบริษัทที่กำลังรอ หรืออนุมัติแล้ว (แยกออกมาอยู่นอก Banner) */}
            {['PENDING', 'APPROVED'].includes(internshipStatus) && application && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                  <img
                    src={application.establishment?.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
                    alt="Company"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
                    {internshipStatus === 'PENDING' ? 'ตำแหน่งที่กำลังยื่นรอ' : 'สถานประกอบการของคุณ'}
                  </p>
                  <h3 className="text-xl font-black text-[#2B4560] mb-1">{application.job?.title}</h3>
                  <p className="text-sm font-bold text-slate-500 flex items-center justify-center md:justify-start gap-2">
                    <Building2 size={16} className="text-blue-500" /> {application.establishment?.name}
                  </p>
                </div>
              </div>
            )}

            {/* 3. Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">สถานประกอบการล่าสุด</p>
                  <p className="text-sm font-bold text-[#2B4560]">ยังไม่ได้เลือก</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {view === 'LIST' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2B4560]">
              <ArrowLeft size={16} /> กลับหน้าหลัก
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialJobs.length > 0 ? (
                initialJobs.map((job: any) => (
                  <JobCard key={job.id} job={job} establishment={job.establishment} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">ไม่พบข้อมูลตำแหน่งงาน</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- แยก JobCard ออกมาไว้นอก DashboardClient ---
const JobCard = ({ job, establishment }: any) => (
  <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden text-left">
    <div className="p-8 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block italic">
            Featured Job
          </span>
          <h3 className="text-xl md:text-2xl font-black text-[#2B4560] leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-500 font-bold flex items-center gap-2 text-sm">
            <Building2 size={16} className="text-slate-300" /> {establishment?.name || "ไม่ระบุบริษัท"}
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl border border-slate-100 overflow-hidden shadow-inner flex-shrink-0">
          <img
            src={establishment?.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"}
            className="w-full h-full object-cover"
            alt="company"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2">
          💰 {job.salary > 0 ? `${job.salary.toLocaleString()} / เดือน` : "ตามตกลง"}
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 mb-4 text-[11px] font-bold">
        <MapPin size={14} className="text-blue-500" /> {establishment?.address?.split(' ')[0] || "ไม่ระบุสถานที่"}
      </div>
    </div>

    <div className="px-8 pb-8 flex gap-3">
      <Link href={`/student/jobs/${job.id}`} className="flex-1">
        <button className="w-full py-4 bg-[#2B4560] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all">
          รายละเอียดงาน
        </button>
      </Link>
      <Link href={`/establishments/${establishment?.id}`}>
        <button className="w-14 h-14 bg-slate-50 text-[#2B4560] rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
          <Building2 size={20} />
        </button>
      </Link>
    </div>
  </div>
);
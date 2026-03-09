'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Bell, LogOut, User, MapPin, 
  Briefcase, Calendar, ChevronRight, ArrowLeft,
  Building2, FileText, CalendarDays, ArrowRight,
  GraduationCap, ChevronDown
} from 'lucide-react';

export function DashboardClient({ initialEstablishments = [], currentUser }: { initialEstablishments?: any[], currentUser? : any}) {
  
  const [view, setView] = useState<'HOME' | 'LIST'>('HOME');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = {
    name: currentUser?.name || "ผู้ใช้งาน",
    avatar: currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=2B4560&color=fff`, 
    year: currentUser?.year || 3,
    email: currentUser?.email || ""
  };

  // ดึงหมวดหมู่จากข้อมูลจริงมาทำ Dropdown
  const CATEGORIES = useMemo(() => {
    const cats = initialEstablishments.map((e: any) => e.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [initialEstablishments]);

  const displayedEstablishments = useMemo(() => {
    const data = initialEstablishments || [];
    return data.filter((est: any) => {
      const category = est.category || "";
      const name = est.name || "";
      const desc = est.description || "";
      const matchCategory = activeCategory === 'ALL' || category === activeCategory;
      const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [initialEstablishments, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col font-sans text-slate-600 text-left">
      
      {/* --- Navbar --- */}
      <nav className="h-20 bg-white shadow-sm px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="bg-[#2B4560] p-1.5 rounded-lg text-white shadow-sm">
            <Building2 size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#2B4560] uppercase leading-none">CO-EMS</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Student Information System</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-[#2B4560] hover:bg-slate-50 rounded-full transition-all relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)} 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm hover:scale-105 transition-transform"
            >
              <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                   <p className="text-xs text-slate-400 font-black uppercase tracking-wider">บัญชีผู้ใช้</p>
                   <p className="text-sm font-bold text-[#2B4560] truncate">{user.name}</p>
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <User size={18} className="text-blue-500" /> โปรไฟล์ของฉัน
                </Link>
                <div className="h-px bg-slate-50 my-1"></div>
                <button onClick={() => {}} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-black text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={18} /> ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl font-black text-[#2B4560] tracking-tight mb-2">สวัสดีคุณ {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 font-medium">ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษาของคุณ</p>
          </div>
          
          {/* ✅ เปลี่ยนจาก button เป็น Link ชี้ไปหน้าเต็ม */}
          <Link 
            href="/establishments/add" 
            className="flex items-center gap-2.5 bg-[#2B4560] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:shadow-[#2B4560]/20 hover:-translate-y-1 transition-all w-fit"
          >
            <Building2 size={18} /> เพิ่มสถานประกอบการใหม่
          </Link>
        </div>

        {view === 'HOME' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <ActionCard icon={<Briefcase size={32} />} title="สถานประกอบการ" description="ค้นหาและยื่นคำร้องสถานประกอบการที่สนใจ" btnLabel="ค้นหาข้อมูล" onClick={() => setView('LIST')} />
            <ActionCard icon={<FileText size={32} />} title="สถานะการยื่นเรื่อง" description="ตรวจสอบผลการอนุมัติและสถานะใบสมัคร" btnLabel="ดูสถานะ" onClick={() => {}} />
            <ActionCard icon={<CalendarDays size={32} />} title="ตารางนัดหมาย" description="ติดตามกำหนดการนิเทศและวันสัมภาษณ์" btnLabel="ดูตารางงาน" onClick={() => {}} />
          </div>
        )}

        {view === 'LIST' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button onClick={() => setView('HOME')} className="mb-6 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2B4560] transition-colors">
              <ArrowLeft size={16} /> กลับหน้าหลัก
            </button>

            {/* 🚩 Search & Dropdown Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2B4560] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อบริษัทหรือตำแหน่งงาน..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#2B4560]/5 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="relative min-w-[320px] group">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2B4560]" size={20} />
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full pl-14 pr-12 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 shadow-sm appearance-none focus:ring-4 focus:ring-[#2B4560]/5 outline-none cursor-pointer"
                >
                  <option value="ALL">🏢 แสดงทุกสาขาวิชา</option>
                  {CATEGORIES.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {displayedEstablishments.length > 0 ? (
    displayedEstablishments.map((est: any) => 
      // 🔥 หัวใจสำคัญ: ถ้า 1 บริษัทมีหลายงาน ให้โชว์แยกใบละงานเลย
      est.jobs?.map((job: any) => (
        <JobCard key={job.id} job={job} establishment={est} />
      ))
    )
  ) : (
    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
       <Search size={48} className="mx-auto mb-4 text-slate-200" />
       <p className="text-slate-400 font-black uppercase tracking-widest">ไม่พบตำแหน่งงานที่ค้นหา</p>
    </div>
  )}
</div>
          </div>
        )}
      </main>

    </div>
  );
}

// UI Components (คงเดิม)
const ActionCard = ({ icon, title, description, btnLabel, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col cursor-pointer h-full group border-b-4 border-b-transparent hover:border-b-[#2B4560]">
    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#2B4560] group-hover:text-white transition-all shadow-inner">{icon}</div>
    <div className="flex-1 mb-10">
      <h3 className="text-2xl font-black text-[#2B4560] mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-wider">{description}</p>
    </div>
    <button className="w-full py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl text-[#2B4560] text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-[#2B4560] group-hover:text-white transition-all flex items-center justify-center gap-2">
      {btnLabel} <ArrowRight size={14} />
    </button>
  </div>
);

const JobCard = ({ job, establishment }: any) => (
  <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden">
    {/* ส่วนบน: ข้อมูลงาน */}
    <div className="p-8 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block italic">
            Featured Job
          </span>
          <h3 className="text-2xl font-black text-[#2B4560] leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-500 font-bold flex items-center gap-2">
            <Building2 size={16} className="text-slate-300" /> {establishment.name}
          </p>
        </div>
        {/* รูปบริษัทขนาดเล็ก */}
        <div className="w-14 h-14 rounded-2xl border border-slate-100 overflow-hidden shadow-inner flex-shrink-0">
          <img 
            src={establishment.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"} 
            className="w-full h-full object-cover" 
            alt={establishment.name} 
          />
        </div>
      </div>

      {/* สวัสดิการ & รายละเอียดเงินเดือน */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2">
           💰 {job.salary > 0 ? `${job.salary.toLocaleString()} / เดือน` : "ตามตกลง"}
        </div>
        {job.hasShuttle && (
          <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2">
             🚌 รถรับส่ง
          </div>
        )}
        {job.hasDorm && (
          <div className="bg-purple-50 text-purple-600 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2">
             🏠 มีหอพัก
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400 mb-4 text-[11px] font-bold">
        <MapPin size={14} className="text-blue-500" /> {establishment.address?.split(' ')[0]}
      </div>
    </div>

    {/* ส่วนล่าง: ปุ่มกด */}
    <div className="px-8 pb-8 flex gap-3">
      <Link href={`/jobs/${job.id}`} className="flex-1">
        <button className="w-full py-4 bg-[#2B4560] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all">
          รายละเอียดงาน
        </button>
      </Link>
      <Link href={`/establishments/${establishment.id}`}>
        <button className="w-14 h-14 bg-slate-50 text-[#2B4560] rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100">
          <Building2 size={20} />
        </button>
      </Link>
    </div>
  </div>
);
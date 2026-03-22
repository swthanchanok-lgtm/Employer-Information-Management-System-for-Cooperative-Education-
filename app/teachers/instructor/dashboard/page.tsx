'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { 
  Users, CheckCircle, ChevronRight, Building2, Briefcase, FileText,
  UserCircle, MapPin, Clock, ArrowRight, Search, Sparkles
} from 'lucide-react';

export default function DashboardPage({ 
  currentUser, 
  pendingRequests = [], 
  myStudents = [] // 🚩 ดึงข้อมูลเด็กจากของจริงตรงนี้
}: any) {
  
  const isCoordinator = currentUser?.role === 'COURSE_INSTRUCTOR' || true; 
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  
  // State สำหรับเก็บตัวเลขรออนุมัติ
  const [pendingEstCount, setPendingEstCount] = useState<number | string>('...'); 
  const [pendingJobCount, setPendingJobCount] = useState<number | string>('...'); 
  const [pendingAppCount, setPendingAppCount] = useState<number | string>('...');

  useEffect(() => {
    fetch('/api/academic-years/current')
      .then(res => res.json())
      .then(data => setCurrentTerm(data))
      .catch(err => console.error("Term error:", err)); 
      
    fetch('/api/instructor/dashboard/pending-counts')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setPendingEstCount(data.pendingEstCount || 0);
        setPendingJobCount(data.pendingJobCount || 0);
        setPendingAppCount(data.pendingAppCount || 0);
      })
      .catch(err => {
        console.error("Failed to fetch counts", err);
        setPendingEstCount(0);
        setPendingJobCount(0);
        setPendingAppCount(0); 
      });
  }, []); 

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12 text-left">
      
      {/* 🟢 1. ส่วน Header */}
      <div className="relative bg-[#2B4560] rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-[#2B4560]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-emerald-300 font-bold tracking-widest uppercase text-xs">Instructor Workspace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex flex-wrap items-baseline gap-4">
              แดชบอร์ดอาจารย์
              {currentTerm && (
                <span className="text-xl md:text-2xl font-medium text-slate-300 tracking-normal border-l-2 border-white/20 pl-4">
                  ภาคเรียนที่ {currentTerm.semester}/{currentTerm.year}
                </span>
              )}
            </h1>
            <p className="text-slate-300 font-medium text-lg mt-4 flex items-center gap-2">
              ยินดีต้อนรับกลับมา, <span className="text-white font-bold">อาจารย์{currentUser?.name || 'รณชัย'}</span> 👋
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        
        {/* 🟦 2. เมนูการจัดการประจำวิชา (ภาพรวมการอนุมัติ) */}
        {isCoordinator && (
          <section className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
             <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <CheckCircle className="text-emerald-600" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2B4560] tracking-tight">รายการรอตรวจสอบ</h2>
                  <p className="text-slate-400 font-bold text-sm">ข้อมูลที่ต้องการการอนุมัติจากอาจารย์ประจำวิชา</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 🌟 การ์ด 1: สถานประกอบการ */}
                <Link href="/teachers/instructor/approve-establishments" className="relative overflow-hidden block p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-110 group-hover:opacity-5 transition-all duration-500">
                    <Building2 size={140} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[1.2rem] group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Building2 size={28} />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-full group-hover:bg-emerald-100 transition-colors">
                        <span>จัดการ</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wide">สถานประกอบการใหม่</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-6xl font-black text-[#2B4560] tracking-tighter">{pendingEstCount}</h3>
                        <span className="text-slate-400 font-bold">แห่ง</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 🌟 การ์ด 2: ตำแหน่งงาน */}
                <Link href="/teachers/instructor/approve-jobs" className="relative overflow-hidden block p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-110 group-hover:opacity-5 transition-all duration-500">
                    <Briefcase size={140} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-amber-50 text-amber-600 p-4 rounded-[1.2rem] group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Briefcase size={28} />
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-4 py-2 rounded-full group-hover:bg-amber-100 transition-colors">
                        <span>จัดการ</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wide">ตำแหน่งงานรออนุมัติ</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-6xl font-black text-[#2B4560] tracking-tighter">{pendingJobCount}</h3>
                        <span className="text-slate-400 font-bold">ตำแหน่ง</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 🌟 การ์ด 3: คำร้อง */}
                <Link href="/teachers/instructor/applications" className="relative overflow-hidden block p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:scale-110 group-hover:opacity-5 transition-all duration-500">
                    <FileText size={140} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="bg-rose-50 text-rose-600 p-4 rounded-[1.2rem] group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <FileText size={28} />
                      </div>
                      <div className="flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-4 py-2 rounded-full group-hover:bg-rose-100 transition-colors">
                        <span>จัดการ</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wide">คำร้องขอฝึกงาน</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-6xl font-black text-[#2B4560] tracking-tighter">{pendingAppCount}</h3>
                        <span className="text-slate-400 font-bold">รายการ</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
              </div>
          </section>
        )}

        {/* 🎓 3. Section รายชื่อนักศึกษาในการดูแล (👉 บัวเติม mt-20 ตรงนี้ให้เว้นระยะห่างลงมาค่ะ) */}
        <section className="mt-20 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-end justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Users className="text-blue-600" size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#2B4560] tracking-tight">นักศึกษาในการดูแล</h2>
                <p className="text-slate-400 font-bold text-sm">รายชื่อนักศึกษาที่อยู่ในความดูแลของท่านในเทอมนี้</p>
              </div>
            </div>
            
            {myStudents && myStudents.length > 0 && (
              <button className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#2B4560] bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
                <Search size={16} />
                ค้นหานักศึกษา
              </button>
            )}
          </div>

          {/* 🚩 เช็คว่ามีข้อมูลนักศึกษาไหม ถ้ามีให้โชว์การ์ด ถ้าไม่มีให้โชว์กล่องว่างๆ */}
          {myStudents && myStudents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {myStudents.map((student: any) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/teachers/instructor/students" className="inline-flex items-center gap-2 text-[#2B4560] font-black text-sm bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-full transition-all">
                  ดูรายชื่อนักศึกษาทั้งหมด <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            // 🚩 UI ตอนไม่มีข้อมูลนักศึกษา (Empty State)
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-4 rounded-full text-slate-300 mb-4">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-black text-slate-700 tracking-tight">ยังไม่มีนักศึกษาในการดูแล</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-sm">
                รายชื่อนักศึกษาที่ท่านเป็นอาจารย์นิเทศหรือดูแลรับผิดชอบ จะปรากฏที่นี่เมื่อมีการมอบหมายงานในระบบ
              </p>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

// 🃏 StudentCard Component
const StudentCard = ({ id, name, company, position, status }: any) => {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS': return { color: 'bg-blue-50 text-blue-600 border-blue-200', icon: <Clock size={12}/>, text: 'กำลังฝึกงาน' };
      case 'COMPLETED': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <CheckCircle size={12}/>, text: 'ประเมินเสร็จสิ้น' };
      case 'PENDING': return { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: <Clock size={12}/>, text: 'รอเริ่มงาน' };
      default: return { color: 'bg-slate-50 text-slate-600 border-slate-200', icon: <CheckCircle size={12}/>, text: status || 'ยังไม่ระบุ' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group flex flex-col h-full text-left">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-[#2B4560] group-hover:text-white transition-colors duration-300">
            <UserCircle size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-black text-[#2B4560] text-lg tracking-tight">{name || 'ไม่ระบุชื่อ'}</h4>
            <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">ID: {id || '-'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        <div className="flex items-start gap-2">
          <Briefcase size={16} className="text-slate-300 mt-0.5 shrink-0" />
          <p className="text-sm font-bold text-slate-600 line-clamp-1">{position || 'ไม่ได้ระบุตำแหน่ง'}</p>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-slate-300 mt-0.5 shrink-0" />
          <p className="text-sm font-bold text-slate-500 line-clamp-2 leading-relaxed">{company || 'ไม่ได้ระบุสถานประกอบการ'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide ${statusConfig.color}`}>
          {statusConfig.icon}
          {statusConfig.text}
        </div>
        
        <Link 
          href={`/teachers/instructor/students/${id}`} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#00BCD4] group-hover:text-white transition-all"
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
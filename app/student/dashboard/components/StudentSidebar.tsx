'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  FileSearch, 
  ClipboardCheck, 
  UserCircle, 
  LogOut,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function StudentSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { 
      title: 'หน้าหลัก', 
      icon: <Home size={18} />, 
      path: '/student/dashboard'
    },
    { 
      title: 'ค้นหาสถานประกอบการ', 
      icon: <Building2 size={18} />, 
      path: '/student/establishments' 
    },
    { 
      title: 'สถานะการยื่นเรื่อง', 
      icon: <FileSearch size={18} />, 
      path: '/dashboard/status' 
    },
    { 
      title: 'บันทึกการฝึกงาน', 
      icon: <ClipboardCheck size={18} />, 
      path: '/dashboard/journal' 
    },
    { 
      title: 'ข้อมูลส่วนตัว', 
      icon: <UserCircle size={18} />, 
      path: '/dashboard/profile' 
    },
  ];

  return (
    <aside className="w-72 h-screen bg-[#FDFDFD] border-r border-slate-100 flex flex-col sticky top-0 z-50">
      
      {/* 🛡️ Logo Section: คุมโทนเหมือนกันเป๊ะ */}
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#2B4560] p-3 rounded-xl text-white shadow-xl shadow-[#2B4560]/10">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#2B4560] leading-none uppercase tracking-tighter">CO-EMS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
               Student <Sparkles size={10} className="text-amber-400"/>
            </p>
          </div>
        </div>
      </div>

      {/* 🚩 Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-8">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Internship Menu</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`
                flex items-center justify-between px-5 py-4 rounded-3xl border border-transparent transition-all duration-300 group
                ${isActive 
                  ? 'bg-[#2B4560] text-white shadow-xl shadow-[#2B4560]/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#2B4560]'}
              `}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-bold text-sm tracking-tight">{item.title}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-amber-400' : 'bg-transparent'}`} />
            </Link>
          );
        })}
      </nav>

      {/* 👥 Footer */}
      <div className="p-4 border-t border-slate-50">
        <button className="flex items-center justify-center gap-3 w-full px-6 py-4 text-[11px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}

// แอบใส่ Icon นิดนึงจ้าแม่
function GraduationCap({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
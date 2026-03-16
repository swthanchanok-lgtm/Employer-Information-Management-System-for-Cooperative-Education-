'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileCheck, 
  LogOut, 
  Settings,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function SupervisorSidebar() {
  const pathname = usePathname();

  // เมนูเดิมของแม่ครีม ลูกเก็บไว้ครบจ้า
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/supervisor/dashboard' 
    },
    { 
      title: 'นักศึกษาในความดูแล', 
      icon: <Users size={18} />, 
      path: '/supervisor/students' 
    },
    { 
      title: 'ตารางนิเทศ', 
      icon: <Calendar size={18} />, 
      path: '/supervisor/schedule' 
    },
    { 
      title: 'แผนที่สถานประกอบการ', 
      icon: <MapPin size={18} />, 
      path: '/supervisor/map' 
    },
    { 
      title: 'ผลการประเมิน', 
      icon: <FileCheck size={18} />, 
      path: '/supervisor/evaluation' 
    },
  ];

  return (
    // 🎨 คุมโทนสีพื้นหลังขาว- slate เบาๆ แบบเดียวกับหน้านักศึกษา
    <aside className="w-72 h-screen bg-[#2B4560] text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      
      {/* 🛡️ Logo Section: สีน้ำเงินเข้ม `#2B4560` แบบเริ่ดๆ */}
      <div className="p-8 flex items-center gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#2B4560] p-3 rounded-xl text-white shadow-xl shadow-[#2B4560]/10">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl font-white text-[white] leading-none uppercase tracking-tighter">CO-EMS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
               Supervisor <Sparkles size={10} className="text-emerald-400"/>
            </p>
          </div>
        </div>
      </div>

      {/* 🚩 Navigation Links: สีและดีไซน์แบบเดียวกับ Sidebar อันอื่นเลยแม่ */}
      <nav className="flex-1 px-4 space-y-2 mt-8">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">เมนูหลัก ( Supervisor )</p>
        
        {menuItems.map((item) => {
          // เช็คว่าเมนูนี้กำลัง Active อยู่ไหมจ๊ะแม่ครีม
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
              
              {/* ✅ ไอคอนลูกศรฝั่งขวา (เหมือนดีไซน์สับๆ ที่หน้านักศึกษา) */}
              <FileCheck size={16} className={`transition-transform group-hover:translate-x-1 ${isActive ? 'text-white' : 'text-slate-200'}`} />
            </Link>
          );
        })}
      </nav>

      {/* 👥 Account Section / Footer: ดูแลง่ายๆ */}
      <div className="p-4 border-t border-slate-50">
        <button className="flex items-center justify-center gap-3 w-full px-6 py-4 text-[11px] font-black uppercase tracking-widest bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
          <LogOut size={16} />
          ออกจากระบบ (Supervisor)
        </button>
      </div>
    </aside>
  );
}
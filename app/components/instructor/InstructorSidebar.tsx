'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Building2, 
  Settings,
  LogOut,
  CalendarDays
} from 'lucide-react';

export default function InstructorSidebar() {
  const pathname = usePathname();

  const menuItems = [
  { name: 'แดชบอร์ด', href: '/teachers/instructor/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'จัดการปีการศึกษา', href: '/teachers/instructor/academic', icon: <CalendarDays size={20} /> },
  { name: 'รายชื่อนักศึกษา', href: '/teachers/instructor/students', icon: <Users size={20} /> },
  { name: 'สถานประกอบการ', href: '/teachers/instructor/establishments', icon: <Building2 size={20} /> },
  { name: 'อนุมัติสถานประกอบการ', href: '/teachers/instructor/approve-establishments', icon: <Building2 size={20} /> },
  { name: 'อนุมัติตำแหน่งงาน', href: '/teachers/instructor/approve-jobs', icon: <Building2 size={20} /> },
  { name: 'คำร้องขอฝึกงาน', href: '/teachers/instructor/applications', icon: <Building2 size={20} /> },
];

  return (
    <aside className="w-72 h-screen bg-[#2B4560] text-white flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Logo ส่วนหัว */}
      <div className="p-8 flex items-center gap-3 border-b border-white/10">
        <div className="bg-white p-2 rounded-xl text-[#2B4560]">
          <GraduationCap size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Instructor</h2>
          <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest mt-1">Co-op Management</p>
        </div>
      </div>

      {/* รายการเมนู */}
      <nav className="flex-1 p-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-white text-[#2B4560] shadow-lg shadow-black/10' 
                : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ส่วนล่าง (Logout) */}
      <div className="p-6 border-t border-white/10">
        <button className="w-full flex items-center gap-4 px-5 py-4 text-red-300 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={20} />
          <span className="text-sm uppercase tracking-widest">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
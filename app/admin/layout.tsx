'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserPlus, 
  Building2, Settings, LogOut, 
  FileText, Bell, ChevronLeft
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Building2 size={20} />, label: 'อนุมัติบริษัท', href: '/admin/approve-establishments' },
    { icon: <UserPlus size={20} />, label: 'เพิ่มสมาชิก', href: '/admin/add-member' },
    { icon: <Users size={20} />, label: 'รายชื่อสมาชิก', href: '/admin/users' },
    { icon: <FileText size={20} />, label: 'จัดการข้อมูลนิเทศ', href: '/admin/reports' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- Sidebar (แถบข้าง) --- */}
      <aside className="w-72 bg-[#2B4560] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-[100]">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white/10 p-2 rounded-xl">
            <Building2 size={24} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none">CO-EMS</span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-white/40 group-hover:text-blue-400'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* --- Main Content Area (ส่วนเนื้อหา) --- */}
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-end sticky top-0 z-[90]">
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-3">
                 <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-[#2B4560] leading-none uppercase">Admin Staff</p>
                    <p className="text-[10px] text-slate-400 font-medium">University Office</p>
                 </div>
                 <div className="w-10 h-10 bg-[#2B4560] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#2B4560]/20">A</div>
              </div>
           </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
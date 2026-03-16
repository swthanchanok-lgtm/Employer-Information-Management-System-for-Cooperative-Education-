'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// 🚩 1. เพิ่ม getSession นำเข้าจาก next-auth/react
import { signIn, getSession } from 'next-auth/react'; 

interface LoginViewProps {
  onLogin?: (username: string, role: any) => void;
}

const LOGO_URL = "https://cdn.phototourl.com/uploads/2026-03-14-39df2c04-7afa-459e-b880-155166934e07.png"; 

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false, 
    });

    if (result?.error) {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      setIsLoading(false);
    } else {
      // 🚩 2. บังคับดึงข้อมูล Session ใหม่ล่าสุดจากเซิร์ฟเวอร์ทันที ไม่ต้องรอ hook!
      const freshSession = await getSession();
      const userRole = (freshSession?.user as any)?.role;

      // 🚩 3. ใช้ window.location.href ย้ายหน้าพร้อมล้างสมอง Next.js ไปเลย
      if (userRole === 'ADMIN') {
        window.location.href = '/admin/dashboard';
      } else if (userRole === 'INSTRUCTOR' || userRole === 'COURSE_INSTRUCTOR') {
        window.location.href = '/teachers/instructor/dashboard';
      } else if (userRole === 'SUPERVISOR') {
        window.location.href = '/supervisor/dashboard';
      } else {
        window.location.href = '/student/dashboard';
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden text-left">
      {/* 🟦 Left Panel (Hero Section) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0A192F]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale-[0.3]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1600&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-[#0A192F]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A192F] via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-24 flex flex-col justify-center h-full w-full text-left">
          <div className="flex items-center gap-5 mb-14">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center">
              <img src={LOGO_URL} alt="CO-EMS Logo" className="w-12 h-12 object-contain" />
            </div>
            <div className="h-10 w-0.5 bg-white/30 rounded-full mx-1"></div>
            <h1 className="text-4xl font-black tracking-tighter text-white">CO-EMS</h1>
          </div>
          
          <div className="max-w-2xl text-left">
            <h2 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
              ยินดีต้อนรับเข้าสู่ <br/>
              <span className="text-[#00BCD4]">CO-EMS Portal</span>
            </h2>
            <p className="text-xl font-medium text-slate-300 leading-relaxed mb-16 opacity-80">
              ระบบบริหารจัดการการฝึกงานและสหกิจศึกษา <br/>
              สำหรับภาควิชาวิศวกรรมคอมพิวเตอร์
            </p>
          </div>
        </div>
      </div>

      {/* ⬜ Right Panel (Login Form) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white relative">
        <div className="w-full max-w-sm">
          <div className="mb-14 text-center">
            <h3 className="text-4xl font-black text-[#1A2B48] mb-3 tracking-tighter">เข้าสู่ระบบ</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] opacity-60">Faculty Administrative Control Center</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3 text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username / ID</label>
              <input 
                type="text" 
                required 
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-5 bg-[#F8FAFC] border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-[#00BCD4]/20 focus:ring-4 focus:ring-[#00BCD4]/5 transition-all outline-none font-bold text-sm text-[#1A2B48] placeholder:text-slate-300 shadow-sm disabled:opacity-50" 
                placeholder="รหัสนักศึกษา หรือ รหัสบุคลากร" 
              />
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-slate-300 hover:text-[#00BCD4] transition-colors uppercase tracking-widest">ลืมรหัสผ่าน?</button>
              </div>
              <input 
                type="password" 
                required 
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 bg-[#F8FAFC] border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-[#00BCD4]/20 focus:ring-4 focus:ring-[#00BCD4]/5 transition-all outline-none font-bold text-sm text-[#1A2B48] placeholder:text-slate-300 shadow-sm disabled:opacity-50" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A2B48] hover:bg-[#0A192F] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-[#1A2B48]/20 transition-all uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 group disabled:bg-slate-400 disabled:shadow-none mt-4"
            >
              {isLoading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="mt-20 text-center">
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] leading-relaxed">
              FACULTY OF ENGINEERING & <br/> INDUSTRIAL TECHNOLOGY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
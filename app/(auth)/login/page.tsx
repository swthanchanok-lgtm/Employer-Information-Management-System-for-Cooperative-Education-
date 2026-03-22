'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// 🚩 นำเข้า login action ที่เราสร้างไว้
import { login } from '@/app/actions/auth'; 

interface LoginViewProps {
  onLogin?: (username: string, role: any) => void;
}

const LOGO_URL = "https://cdn.phototourl.com/uploads/2026-03-14-39df2c04-7afa-459e-b880-155166934e07.png"; 

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🚩 ใช้ฟังก์ชัน handleSubmit เพื่อคุยกับ Server Action
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      // 🚩 เรียกใช้ระบบ Login กลางของ KSU
      const result = await login(null, formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // ถ้าสำเร็จ ระบบใน auth.ts จะสั่ง redirect ไปหน้า /admin หรือ Dashboard เองจ้า
        //
      }
    } catch (err) {
      setError("ระบบขัดข้องชั่วคราว จ้าแม่!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden text-left">
      {/* 🟦 Left Panel (Hero Section) - UI เดิมเป๊ะๆ */}
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

      {/* ⬜ Right Panel (Login Form) - ปรับไส้ในนิดหน่อย */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white relative">
        <div className="w-full max-w-sm">
          <div className="mb-14 text-center">
            <h3 className="text-4xl font-black text-[#1A2B48] mb-3 tracking-tighter">เข้าสู่ระบบ</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] opacity-60">KSU LDAP AUTHENTICATION</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3 text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username / ID</label>
              <input 
                name="username" // 🚩 ต้องมี name ให้ตรงกับที่ auth.ts รับ
                type="text" 
                required 
                disabled={isLoading}
                className="w-full px-6 py-5 bg-[#F8FAFC] border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-[#00BCD4]/20 focus:ring-4 focus:ring-[#00BCD4]/5 transition-all outline-none font-bold text-sm text-[#1A2B48] placeholder:text-slate-300 shadow-sm disabled:opacity-50" 
                placeholder="รหัสนักศึกษา หรือ รหัสบุคลากร" 
              />
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <input 
                name="password" // 🚩 ต้องมี name ให้ตรงกับที่ auth.ts รับ
                type="password" 
                required 
                disabled={isLoading}
                className="w-full px-6 py-5 bg-[#F8FAFC] border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-[#00BCD4]/20 focus:ring-4 focus:ring-[#00BCD4]/5 transition-all outline-none font-bold text-sm text-[#1A2B48] placeholder:text-slate-300 shadow-sm disabled:opacity-50" 
                placeholder="••••••••" 
              />
            </div>

            {/* 🚩 แสดงข้อความ Error ถ้าล็อกอินไม่ผ่าน */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A2B48] hover:bg-[#0A192F] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-[#1A2B48]/20 transition-all uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 group disabled:bg-slate-400 disabled:shadow-none mt-4"
            >
              {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบกลาง KSU"}
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
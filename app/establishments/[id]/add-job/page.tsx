'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Save, DollarSign, Truck, Home, FileText, Sparkles } from 'lucide-react';

export default function AddJobPage() {
  const router = useRouter();
  const params = useParams();
  const establishmentId = params.id; 

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    description: '', // 🚩 เพิ่มฟิลด์รายละเอียด/คุณสมบัติ
    hasShuttle: false,
    hasDorm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          salary: Number(formData.salary), // แปลงเป็นตัวเลขก่อนส่ง
          establishmentId 
        }),
      });

      if (res.ok) {
        alert("🎉 บันทึกตำแหน่งงานเรียบร้อย! รออาจารย์ตรวจสอบนะคะแม่");
        router.back(); 
      } else {
        const errorData = await res.json();
        alert(`❌ พลาดไปนิด: ${errorData.message || 'บันทึกไม่สำเร็จ'}`);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์จ้า");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-4 md:p-12 font-sans text-left">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2B4560] transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ
        </button>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
          {/* ตกแต่งเล็กน้อยให้ดูแพง */}
          <div className="absolute top-0 right-0 p-8 text-blue-50/50">
            <Sparkles size={80} />
          </div>

          <div className="flex items-center gap-6 mb-12 relative z-10">
            <div className="bg-[#2B4560] p-5 rounded-[2rem] text-white shadow-xl shadow-blue-900/20">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#2B4560] tracking-tighter">เพิ่มตำแหน่งงานใหม่</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Job Offering Registration</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {/* 1. ชื่อตำแหน่ง */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> ชื่อตำแหน่งงาน
              </label>
              <input 
                required
                type="text" 
                placeholder="เช่น Software Engineer, การตลาด..."
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] focus:ring-4 focus:ring-[#2B4560]/5 focus:bg-white outline-none font-bold text-[#2B4560] transition-all placeholder:text-slate-300"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* 2. เงินเดือน */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ค่าตอบแทน (บาท/เดือน)
              </label>
              <div className="relative">
                <div className="absolute left-7 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xl">฿</div>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] focus:ring-4 focus:ring-[#2B4560]/5 focus:bg-white outline-none font-bold text-[#2B4560] transition-all placeholder:text-slate-300"
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>

            {/* 🚩 3. ช่องใส่คุณสมบัติ (เพิ่มใหม่จ้าแม่!) */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> รายละเอียดงานและคุณสมบัติ
              </label>
              <div className="relative">
                <FileText className="absolute left-7 top-7 text-slate-300" size={20} />
                <textarea 
                  required
                  rows={5}
                  placeholder="ระบุหน้าที่ความรับผิดชอบ และคุณสมบัติที่ต้องการ (เช่น ปวส. สาขาคอมพิวเตอร์, ขยัน, อดทน)"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-[#2B4560]/5 focus:bg-white outline-none font-bold text-[#2B4560] transition-all placeholder:text-slate-300 leading-relaxed"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* 4. สวัสดิการ */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> สวัสดิการพื้นฐาน
              </label>
              <div className="grid grid-cols-2 gap-4">
                <WelfareButton 
                  active={formData.hasShuttle} 
                  onClick={() => setFormData({...formData, hasShuttle: !formData.hasShuttle})}
                  icon={<Truck size={24} />}
                  label="มีรถรับส่ง"
                />
                <WelfareButton 
                  active={formData.hasDorm} 
                  onClick={() => setFormData({...formData, hasDorm: !formData.hasDorm})}
                  icon={<Home size={24} />}
                  label="มีหอพัก"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-[#2B4560] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/20 hover:-translate-y-2 active:scale-95 transition-all flex items-center justify-center gap-3 mt-12 group">
              <Save size={20} className="group-hover:rotate-12 transition-transform" /> บันทึกข้อมูลตำแหน่งงาน
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Component เสริมช่วยให้โค้ดสะอาดจ้าแม่
const WelfareButton = ({ active, onClick, icon, label }: any) => (
  <div 
    onClick={onClick}
    className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center gap-4 group ${
      active 
      ? 'border-[#2B4560] bg-[#2B4560] text-white shadow-xl shadow-blue-900/10' 
      : 'border-slate-50 bg-slate-50 text-slate-300 hover:border-slate-200'
    }`}
  >
    <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);
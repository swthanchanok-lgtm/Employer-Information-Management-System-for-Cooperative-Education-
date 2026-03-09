'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Save, DollarSign, Truck, Home } from 'lucide-react';

export default function AddJobPage() {
  const router = useRouter();
  const params = useParams();
  const establishmentId = params.id; // ดึง ID บริษัทจาก URL

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    hasShuttle: false,
    hasDorm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, establishmentId }),
      });

      if (res.ok) {
        alert("ส่งข้อมูลตำแหน่งงานเรียบร้อย! รออาจารย์อนุมัตินะคะ");
        router.back(); // กลับไปหน้าก่อนหน้า
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#2B4560]">
          <ArrowLeft size={16} /> ย้อนกลับ
        </button>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#2B4560] p-4 rounded-2xl text-white">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#2B4560]">เพิ่มตำแหน่งงานใหม่</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">ระบุรายละเอียดเพื่อส่งให้อาจารย์ตรวจสอบ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ชื่อตำแหน่ง */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">ชื่อตำแหน่งงาน</label>
              <input 
                required
                type="text" 
                placeholder="เช่น Software Engineer, การตลาด..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#2B4560]/5 outline-none font-bold"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* เงินเดือน */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">ค่าตอบแทน (บาท/เดือน)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#2B4560]/5 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>

            {/* สวัสดิการ */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, hasShuttle: !formData.hasShuttle})}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${formData.hasShuttle ? 'border-[#2B4560] bg-[#2B4560]/5' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <Truck size={24} />
                <span className="text-[10px] font-black uppercase">มีรถรับส่ง</span>
              </div>
              <div 
                onClick={() => setFormData({...formData, hasDorm: !formData.hasDorm})}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${formData.hasDorm ? 'border-[#2B4560] bg-[#2B4560]/5' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <Home size={24} />
                <span className="text-[10px] font-black uppercase">มีหอพัก</span>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#2B4560] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#2B4560]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <Save size={20} /> บันทึกข้อมูลตำแหน่งงาน
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
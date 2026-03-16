'use client';
import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react'; // 🚩 เพิ่มตัวนี้มาช่วยเช็ค ID ให้แม่จ้า

export default function InstructorAcademicPage() {
  // 1. ใช้ useSession ดึงข้อมูลอาจารย์ที่ Login อยู่มาใช้โดยตรงเลยแม่ ไม่ต้องรอรับจาก Props
  const { data: session } = useSession();
  const currentUser = session?.user as any;

  const [year, setYear] = useState('2568');
  const [semester, setSemester] = useState('1');
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 ดึงข้อมูลปีการศึกษาที่มีอยู่มาโชว์ในตาราง
  const fetchAcademicYears = async () => {
    try {
      const res = await fetch('/api/academic-years');
      if (res.ok) {
        const data = await res.json();
        setAcademicYears(data);
      }
    } catch (error) {
      console.error("ดึงข้อมูลไม่มาจ้า:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  // ✨ ฟังก์ชันเพิ่มข้อมูล (ดึง ID จาก session มาใช้เองเลย)
  const handleCreate = async () => {
  // 1. เช็คก่อนว่ามี ID ไหม (ถ้าไม่มีให้ดึงใหม่)
  const instructorId = currentUser?.id;

  if (!instructorId) {
    alert("ว๊ายแม่! ระบบยังโหลดข้อมูลอาจารย์ไม่เสร็จ ลองรอ 1-2 วินาทีแล้วกดใหม่นะจ๊ะ");
    return;
  }

  try {
    const res = await fetch('/api/academic-years', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        // 🚩 ส่งเป็น Number หรือ String เช็คที่หลังบ้านแม่นะ (หนูใส่ parseInt กันไว้ให้ก่อน)
        year: parseInt(year), 
        semester: parseInt(semester), 
        instructorId: instructorId // ID มาแน่แม่รอบนี้!
      })
    });

    if (res.ok) {
      alert("🎉 สำเร็จแล้วจ้าแม่! ปีการศึกษาใหม่มาแล้ว");
      fetchAcademicYears(); // รีโหลดตารางให้แม่ดูเลย
    } else {
      // 💡 ถ้าขึ้น 400 แสดงว่าข้อมูลซ้ำหรือ Database ไม่รับค่าจ้า
      const errorData = await res.json();
      alert(`พังจ้าแม่! สาเหตุ: ${errorData.message || 'ข้อมูลซ้ำหรือผิดประเภทจ้า'}`);
    }
  } catch (error) {
    console.error("Error จ้า:", error);
    alert("ระบบขัดข้องนิดหน่อยจ้าแม่");
  }
};

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500 text-left">
      {/* 🟦 ฟอร์มเพิ่มข้อมูล */}
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-[#2B4560] mb-8 flex items-center gap-3">
          <GraduationCap size={40} className="text-blue-500" /> ตั้งค่าปีการศึกษา
        </h1>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ปีการศึกษา (พ.ศ.)</label>
              <input 
                type="number" 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl mt-2 font-bold text-[#2B4560] focus:ring-2 ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ภาคเรียน</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl mt-2 font-bold text-[#2B4560] focus:ring-2 ring-blue-500 outline-none"
              >
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
                <option value="3">ภาคเรียนฤดูร้อน</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleCreate}
            className="w-full py-5 bg-[#2B4560] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} /> ยืนยันการเพิ่มปีการศึกษา
          </button>
        </div>
      </div>

      {/* 📊 ตารางแสดงรายการ */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-slate-400" />
          <h2 className="text-xl font-bold text-slate-700">รายการปีการศึกษาทั้งหมด</h2>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">ปีการศึกษา</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">ภาคเรียน</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center text-slate-400">กำลังโหลด...</td></tr>
              ) : academicYears.length > 0 ? (
                academicYears.map((item: any) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-[#2B4560]">{item.year}</td>
                    <td className="px-8 py-5 text-center font-bold text-slate-600">{item.semester}</td>
                    <td className="px-8 py-5">
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center justify-center gap-1 w-fit mx-auto">
                        <CheckCircle2 size={12} /> พร้อมใช้งาน
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="p-10 text-center text-slate-300 italic">ยังไม่มีข้อมูลจ้า</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
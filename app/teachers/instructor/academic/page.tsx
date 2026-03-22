'use client';
import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, Calendar, CheckCircle2, Trash2, Loader2 } from 'lucide-react'; // 🚩 เพิ่ม Trash2, Loader2
import { useSession } from 'next-auth/react';

export default function InstructorAcademicPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;

  const [year, setYear] = useState('2568');
  const [semester, setSemester] = useState('1');
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🚩 เพิ่มสถานะกำลังกดบันทึก

  const fetchAcademicYears = async () => {
    try {
      const res = await fetch('/api/academic-years');
      if (res.ok) {
        const data = await res.json();
        // 🚩 แก้ไข: เรียงลำดับปีล่าสุดขึ้นก่อน (Descending Order)
        const sortedData = data.sort((a: any, b: any) => b.year - a.year || b.semester - a.semester);
        setAcademicYears(sortedData);
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

  const handleCreate = async () => {
    const instructorId = currentUser?.id;
    if (!instructorId) {
      alert("ระบบยังโหลดข้อมูลอาจารย์ไม่เสร็จจ้า ลองใหม่นะจ๊ะ");
      return;
    }

    setIsSubmitting(true); // 🚩 เริ่มบันทึก
    try {
      const res = await fetch('/api/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          year: parseInt(year), 
          semester: parseInt(semester), 
          instructorId: instructorId 
        })
      });

      if (res.ok) {
        alert("🎉 สำเร็จแล้วจ้าแม่! ปีการศึกษาใหม่มาแล้ว");
        fetchAcademicYears();
      } else if (res.status === 400) {
        // 🚩 แก้ไข: ดักกรณีข้อมูลซ้ำ
        alert("❌ อุ๊ย! ปีการศึกษาและเทอมนี้มีอยู่ในระบบแล้วจ้า");
      } else {
        alert("พังจ้าแม่! ข้อมูลอาจจะผิดประเภท");
      }
    } catch (error) {
      alert("ระบบขัดข้องนิดหน่อยจ้า");
    } finally {
      setIsSubmitting(false); // 🚩 บันทึกเสร็จแล้ว
    }
  };

  // 🚩 เพิ่มฟังก์ชันลบข้อมูล
  const handleDelete = async (id: number) => {
    if (!confirm("แม่ยืนยันจะลบปีการศึกษานี้ใช่ไหมจ๊ะ?")) return;
    try {
      const res = await fetch(`/api/academic-years/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("ลบเรียบร้อยแล้วจ้า");
        fetchAcademicYears();
      }
    } catch (error) {
      alert("ลบไม่ได้จ้าแม่");
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500 text-left">
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
            disabled={isSubmitting}
            className="w-full py-5 bg-[#2B4560] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการเพิ่มปีการศึกษา'}
          </button>
        </div>
      </div>

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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">กำลังโหลด...</td></tr>
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
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="ลบปีการศึกษา"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-10 text-center text-slate-300 italic">ยังไม่มีข้อมูลจ้า</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
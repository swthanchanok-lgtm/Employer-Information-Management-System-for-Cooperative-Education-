'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { UserCircle, ShieldAlert, GraduationCap, ClipboardCheck } from 'lucide-react';

// 🚩 รับค่า params จาก URL (เช่น ถ้าเข้าเว็บ /student/123 ตัว params.id จะเท่ากับ "123")
export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  
  // 🚩 ดึง Role ของคนที่กำลังล็อกอินอยู่
  const userRole = (session?.user as any)?.role;

  return (
    <div className="max-w-4xl mx-auto p-6 text-left">
      
      {/* 🧑‍🎓 ส่วนหัว: ข้อมูลทั่วไปของนักศึกษา (ทุกคนที่เข้าหน้านี้ได้ จะเห็นตรงนี้) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl mb-6 flex items-center gap-6">
        <div className="bg-blue-50 p-4 rounded-full text-blue-500">
          <UserCircle size={64} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#2B4560] tracking-tight">
            ข้อมูลนักศึกษา
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold">
            <GraduationCap size={18} />
            <p>รหัสนักศึกษา: <span className="text-blue-600">{params.id}</span></p>
          </div>
        </div>
      </div>

      {/* 🔒 ด่านตรวจสิทธิ์: ซ่อน/โชว์ คะแนนประเมิน */}
      {userRole === 'COURSE_INSTRUCTOR' ? (
        
        // ✅ ถ้าเป็นอาจารย์ประจำวิชา (โชว์ข้อมูลความลับ)
        <div className="bg-emerald-50 rounded-[2rem] border border-emerald-200 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-md">
            Confidential
          </div>
          
          <div className="flex items-center gap-3 text-emerald-700 mb-6">
            <ClipboardCheck size={28} />
            <h2 className="text-2xl font-black tracking-tight">ผลการประเมินจากอาจารย์นิเทศ</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-emerald-100/50 shadow-sm space-y-4 text-emerald-900 font-bold">
            {/* ตรงนี้แม่เอาข้อมูลคะแนนจริงๆ มา map ใส่ได้เลยจ้า */}
            <div className="flex justify-between items-center pb-4 border-b border-emerald-50">
              <p>1. ความตรงต่อเวลาและความรับผิดชอบ</p>
              <p className="text-xl font-black text-emerald-600">9/10</p>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-emerald-50">
              <p>2. ความสามารถในการแก้ปัญหา</p>
              <p className="text-xl font-black text-emerald-600">8.5/10</p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="text-lg">รวมคะแนนทั้งหมด</p>
              <p className="text-3xl font-black text-emerald-600">17.5/20</p>
            </div>
          </div>
        </div>

      ) : (
        
        // 🛑 ถ้าเป็น Role อื่นๆ (แอดมิน, อาจารย์นิเทศ, หรือตัวเด็กเอง) จะเห็นแค่นี้
        <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4">
          <div className="bg-slate-200 p-4 rounded-full text-slate-400">
            <ShieldAlert size={48} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-500 tracking-tight">
              ข้อมูลส่วนนี้สงวนสิทธิ์เฉพาะอาจารย์ประจำวิชา
            </h2>
            <p className="text-slate-400 font-bold mt-2 text-sm">
              ผลการประเมินของนักศึกษาจะถูกเก็บเป็นความลับเพื่อใช้ในการประมวลผลเกรดเท่านั้น
            </p>
          </div>
        </div>

      )}

    </div>
  );
}
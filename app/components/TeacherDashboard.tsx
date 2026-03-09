'use client';

import React from 'react';
import { 
  Users, CheckCircle, Clock, MapPin, 
  Search, Bell, LogOut, ChevronRight, GraduationCap, Building
} from 'lucide-react';

// 1. ปรับ Interface ให้ตรงกับที่ DashboardPage ส่งมาเป๊ะๆ
interface TeacherDashboardProps {
  currentUser: any;
  pendingRequests: {
    id: number;
    studentName: string;
    studentUsername: string;
    establishmentName: string;
    createdAt: string;
  }[];
  myStudents: any[];
}

export default function TeacherDashboard({ 
  currentUser, 
  pendingRequests = [], 
  myStudents = [] 
}: TeacherDashboardProps) {
  
  const isCoordinator = currentUser?.role === 'COURSE_INSTRUCTOR'; 

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-left">
      {/* Navbar */}
      <nav className="h-16 bg-[#1E293B] text-white flex items-center justify-between px-8 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight uppercase leading-none">CO-EMS</span>
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Teacher Portal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold leading-none">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{currentUser?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800">
            <img src={`https://ui-avatars.com/api/?name=${currentUser?.name}&background=0D8ABC&color=fff`} alt="profile" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full p-6 md:p-10 space-y-8">
        
        {/* 🟢 ส่วนที่ 1: สำหรับอาจารย์นิเทศ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">นักศึกษาในความดูแล (อาจารย์นิเทศ)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStudents.length > 0 ? (
              myStudents.map((student) => (
                <StudentCard 
                  key={student.id}
                  name={student.name} 
                  id={student.username} // ใช้ username จาก Prisma
                  company={student.establishment?.name || "รอยืนยันสถานประกอบการ"} 
                  // เช็คสถานะการนิเทศ (สมมติจากข้อมูลที่มี)
                  status={student.internshipStatus === 'COMPLETED' ? 'นิเทศเรียบร้อย' : 'กำลังฝึกงาน'} 
                  isDone={student.internshipStatus === 'COMPLETED'} 
                />
              ))
            ) : (
              <div className="col-span-full p-12 text-center bg-white rounded-2xl border-2 border-slate-100 border-dashed">
                <Users className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold">ยังไม่มีนักศึกษาที่ได้รับมอบหมายในขณะนี้</p>
                <p className="text-slate-400 text-xs mt-1">รายชื่อจะปรากฏเมื่อ Admin ทำการจับคู่คุณกับนักศึกษาเรียบร้อยแล้ว</p>
              </div>
            )}
          </div>
        </section>

        {/* 🔴 ส่วนที่ 2: สำหรับอาจารย์ประจำวิชา */}
        {isCoordinator && (
          <section className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">จัดการคำร้องขอฝึกงาน (รออนุมัติ)</h2>
              </div>
              {pendingRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
                  {pendingRequests.length} PENDING
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">นักศึกษา</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานประกอบการ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                      <ApprovalRow 
                        key={req.id}
                        studentName={req.studentName} 
                        studentId={req.studentUsername} // แก้ให้ตรงกับที่แมพมาจาก page.tsx
                        company={req.establishmentName} 
                        date={req.createdAt} 
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                        ไม่พบคำร้องที่รอการอนุมัติ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// UI ย่อย: การ์ดนักศึกษา
const StudentCard = ({ name, id, company, status, isDone }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 bg-slate-100 text-primary rounded-xl flex items-center justify-center font-black text-xl shadow-inner border border-slate-200">
          {name?.[0]}
        </div>
        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${isDone ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
          {status}
        </span>
      </div>
      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{name}</h3>
      <p className="text-[10px] text-slate-400 font-black mb-4 uppercase tracking-widest">ID: {id}</p>
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <Building size={14} className="text-slate-400 shrink-0" /> 
        <span className="truncate font-bold">{company}</span>
      </div>
    </div>
    <button className="w-full py-3 bg-[#1E293B] hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
      บันทึกการนิเทศ <ChevronRight size={14} />
    </button>
  </div>
);

// UI ย่อย: แถวตารางอนุมัติ
const ApprovalRow = ({ studentName, studentId, company, date }: any) => (
  <tr className="hover:bg-slate-50/80 transition-colors">
    <td className="px-6 py-4">
      <p className="text-sm font-bold text-slate-800">{studentName}</p>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {studentId}</p>
    </td>
    <td className="px-6 py-4">
      <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-2">
        <Building size={12} className="text-slate-400" /> {company}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2 justify-center">
        <button className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-sm transition-all">อนุมัติ</button>
        <button className="px-5 py-2 bg-white border border-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">ปฏิเสธ</button>
      </div>
    </td>
  </tr>
);
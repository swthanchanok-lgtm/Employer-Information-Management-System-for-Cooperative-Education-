'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, ClipboardCheck, Building2, GraduationCap, CalendarDays, AlertTriangle } from 'lucide-react';

export default function SupervisionClient({ initialStudents = [], supervisors = [], isSupervisorView = false }: any) {
  const [assignments, setAssignments] = useState<any>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');

  // 🚩 บันทึกทีมอาจารย์อัตโนมัติสำหรับ Admin (คงไว้เหมือนเดิมเป๊ะ)
  const handleToggleAutoSave = async (studentId: number, teacherIds: number[]) => {
    try {
      const res = await fetch('/api/admin/assign-supervision-group', {
        method: 'POST',
        body: JSON.stringify({ studentId, teacherIds }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const updatedGroup = await res.json();
        setAssignments((prev: any) => 
          prev.map((s: any) => s.id === studentId ? { ...s, supervisionGroup: updatedGroup } : s)
        );
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const filteredStudents = assignments.filter((s: any) =>
    `${s.name} ${s.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.username && s.username.includes(searchTerm))
  );

  // 🚩 คำนวณสถิติจากข้อมูลที่มีอยู่ (ไม่ต้องไปแก้ไฟล์แม่)
  const total = assignments.length;
  const supervisedCount = assignments.filter((s: any) => s.supervisionRecords && s.supervisionRecords.length > 0).length;
  const pendingCount = total - supervisedCount;
  const establishmentCount = new Set(assignments.map((s: any) => s.establishment?.id).filter(Boolean)).size;
  const supervisedPercent = total > 0 ? ((supervisedCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto text-left space-y-6">
      <header className="mb-2">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {isSupervisorView ? "Supervisor Mode" : "Supervision Management"}
          </span>
        </div>
        <h1 className="text-4xl font-black text-[#2B4560] tracking-tight">
          {isSupervisorView ? "ภาพรวมการนิเทศ" : "จัดการกลุ่มอาจารย์นิเทศ"}
        </h1>
      </header>

      {/* 🚩 แถบแจ้งเตือน (โชว์เฉพาะโหมดอาจารย์และมีคนค้าง) */}
      {isSupervisorView && pendingCount > 0 && (
        <div className="bg-[#FFF8E6] border border-[#FFE082] p-4 rounded-lg flex items-center gap-3 text-[#B78103] text-sm font-bold shadow-sm">
          <AlertTriangle size={18} />
          <span>แจ้งเตือน: มีนักศึกษา {pendingCount} รายที่ยังไม่ได้รับการนิเทศรอบแรก กรุณาดำเนินการ</span>
        </div>
      )}

      {/* 🚩 การ์ดสถิติ 4 ใบ (โชว์เฉพาะโหมดอาจารย์) */}
      {isSupervisorView && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-t-[#2B4560] shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-1">นักศึกษาทั้งหมด</p>
            <h3 className="text-3xl font-black text-[#1E293B]">{total}</h3>
            <p className="text-[10px] text-slate-400 mt-1">ใน {establishmentCount} สถานประกอบการ</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-t-blue-500 shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-1">นิเทศแล้ว</p>
            <h3 className="text-3xl font-black text-[#1E293B]">{supervisedCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{supervisedPercent}% ของทั้งหมด</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-1">ประเมินเสร็จสิ้น</p>
            <h3 className="text-3xl font-black text-[#1E293B]">0</h3>
            <p className="text-[10px] text-slate-400 mt-1">มีผลการประเมินแล้ว</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-t-red-500 shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-1">รอดำเนินการ</p>
            <h3 className="text-3xl font-black text-red-500">{pendingCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">เกินกำหนดนิเทศ</p>
          </div>
        </div>
      )}

      {/* 🚩 ตารางข้อมูลแบบใหม่ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden mt-4">
        
        {/* แถบหัวตาราง + ค้นหา */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
          <div className="font-bold text-[#1E293B] border-l-4 border-amber-400 pl-3">
            รายชื่อนักศึกษาในความดูแล
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1E293B] text-white">
              <tr>
                <th className="p-4 text-xs font-semibold w-16 text-center">ลำดับ</th>
                <th className="p-4 text-xs font-semibold">ชื่อ-สกุล / รหัสนักศึกษา</th>
                <th className="p-4 text-xs font-semibold">สาขาวิชา</th>
                <th className="p-4 text-xs font-semibold">สถานประกอบการ</th>
                <th className="p-4 text-xs font-semibold">นิเทศล่าสุด</th>
                {isSupervisorView && <th className="p-4 text-xs font-semibold text-center">สถานะ</th>}
                <th className="p-4 text-xs font-semibold text-center">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: any, index: number) => {
                  const currentTeacherIds = student.supervisionGroup?.instructors?.map((i: any) => i.id) || [];
                  const lastRecord = student.supervisionRecords?.[0];
                  const lastDate = lastRecord ? new Date(lastRecord.updatedAt).toLocaleDateString('th-TH') : 'ยังไม่มีการนิเทศ';
                  const isSupervised = !!lastRecord;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-4 text-center text-slate-500 text-sm">{index + 1}</td>
                      <td className="p-4">
                        <p className="font-black text-sm text-[#2B4560]">{student.name} {student.surname}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{student.username || 'ไม่มีรหัสนักศึกษา'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <GraduationCap size={14} className="text-slate-400" />
                          <p className="text-xs">{student.department?.name || 'ทั่วไป'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 size={14} className="text-slate-400" />
                          <p className="text-xs">{student.establishment?.name || 'ยังไม่ระบุ'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarDays size={14} className="text-slate-400" />
                          <p className="text-xs">{lastDate}</p>
                        </div>
                      </td>
                      
                      {/* คอลัมน์สถานะ (โชว์เฉพาะโหมดอาจารย์) */}
                      {isSupervisorView && (
                        <td className="p-4 text-center">
                          {isSupervised ? (
                            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-md">นิเทศแล้ว</span>
                          ) : (
                            <span className="text-red-500 font-bold text-[10px] bg-red-50 px-2 py-1 rounded-md">ยังไม่นิเทศ</span>
                          )}
                        </td>
                      )}

                      <td className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {isSupervisorView ? (
                            <Link href={`/supervisor/dashboard/evaluation/${student.id}`}>
                              <button className="bg-[#1E293B] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-600 transition-colors shadow-sm">
                                บันทึก
                              </button>
                            </Link>
                          ) : (
                            supervisors.map((sv: any) => {
                              const isSelected = currentTeacherIds.includes(sv.id);
                              return (
                                <button
                                  key={sv.id}
                                  onClick={() => {
                                    const newIds = isSelected 
                                      ? currentTeacherIds.filter((id: number) => id !== sv.id)
                                      : [...currentTeacherIds, sv.id];
                                    handleToggleAutoSave(student.id, newIds);
                                  }}
                                  className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border ${
                                    isSelected 
                                    ? 'bg-[#2B4560] border-[#2B4560] text-white' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-500'
                                  }`}
                                >
                                  {isSelected ? '✓ ' : '+ '} {sv.name}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isSupervisorView ? 7 : 6} className="p-8 text-center text-slate-400 font-bold text-sm">
                    ไม่พบข้อมูลนักศึกษาจ้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
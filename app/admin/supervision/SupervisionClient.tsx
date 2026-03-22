'use client';
import React, { useState } from 'react';
import { Search, UserPlus, Users, CheckCircle2, Circle } from 'lucide-react';

export default function AdminSupervisionClient({ initialStudents, supervisors }: any) {
  const [students, setStudents] = useState(initialStudents || []);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAssignGroup = async (studentId: number, teacherIds: number[]) => {
    try {
      const res = await fetch('/api/admin/assign-supervision-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, teacherIds }),
      });
      if (res.ok) {
        // 🚩 แก้ตรงนี้จ้ะแม่! ดึงข้อมูลอาจารย์แบบเต็มๆ มายัดใส่หน้าจอเองเลย ไม่ต้องง้อรอรีเฟรช
        const selectedInstructors = supervisors.filter((sv: any) => teacherIds.includes(sv.id));

        setStudents(students.map((s: any) =>
          s.id === studentId 
            ? { 
                ...s, 
                supervisionGroup: { 
                  ...s.supervisionGroup, 
                  instructors: selectedInstructors // เอาข้อมูลอัปเดตใส่เข้าไปเลย จอจะเปลี่ยนสีทันที!
                } 
              } 
            : s
        ));
      }
    } catch (error) {
      console.error("Error assigning group:", error);
    }
  };

  const filteredStudents = students?.filter((s: any) =>
    s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.username?.includes(searchTerm)
  ) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6"> 
      
      {/* Search Bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
        <div>
          <h2 className="text-xl font-black text-[#2B4560] flex items-center gap-2">
            <UserPlus size={24} className="text-blue-500" /> จัดทีมอาจารย์นิเทศ
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">จัดการกลุ่มอาจารย์สำหรับนักศึกษาฝึกงาน</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 font-bold transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Card Container */}
      <div className="space-y-4">
        {filteredStudents?.map((student: any, index: number) => {
          
          const currentTeacherIds = student.supervisionGroup?.instructors?.map((i: any) => i.id) || [];
          
          const hasTeam = currentTeacherIds.length > 0;

          return (
            <div key={student.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="grid grid-cols-12 items-center p-6 gap-4">
                
                {/* 1. ข้อมูลนักศึกษา */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${hasTeam ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-[#2B4560] leading-tight text-base">
                      {student.name} {student.surname}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{student.username} • {student.department}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 w-fit px-2 py-0.5 rounded-md mt-1">
                      <Users size={12} /> {student.establishment?.name || "ยังไม่ระบุที่ฝึก"}
                    </div>
                  </div>
                </div>

                {/* 2. ทีมอาจารย์ */}
                <div className="col-span-12 md:col-span-6 border-l border-r border-slate-50 px-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest px-2">เลือกทีมอาจารย์นิเทศ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {supervisors?.map((sv: any) => {
                      const isSelected = currentTeacherIds.includes(sv.id);
                      return (
                        <button
                          key={sv.id}
                          onClick={() => {
                            const newIds = isSelected
                              ? currentTeacherIds.filter((id: number) => id !== sv.id)
                              : [...currentTeacherIds, sv.id];
                            handleAssignGroup(student.id, newIds);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border-2 ${
                            isSelected
                              ? 'bg-[#2B4560] border-[#2B4560] text-white shadow-md'
                              : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {sv.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. สถานะและดำเนินการ */}
                <div className="col-span-12 md:col-span-2 text-right flex flex-col items-end gap-2">
                  {hasTeam ? (
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs bg-emerald-50 px-4 py-2 rounded-2xl w-full justify-center">
                      <CheckCircle2 size={16} /> จัดทีมสำเร็จ
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-300 font-black text-xs bg-slate-50 px-4 py-2 rounded-2xl w-full justify-center border-2 border-dashed border-slate-100">
                      <Circle size={16} /> รอจัดทีม
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300 font-bold">
          ไม่พบรายชื่อนักศึกษาจ้าแม่
        </div>
      )}
    </div>
  );
}
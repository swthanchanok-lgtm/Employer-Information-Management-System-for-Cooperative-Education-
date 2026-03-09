'use client';
import React, { useState } from 'react';
import { UserCheck, Save } from 'lucide-react';

export default function SupervisionClient({ students, supervisors }: any) {
  const [assignments, setAssignments] = useState<any>(students);

  const handleSelectSupervisor = async (studentId: string, supervisorId: string) => {
    // ส่งข้อมูลไปอัปเดตใน Database ผ่าน API (ต้องสร้าง API route รองรับ)
    const res = await fetch('/api/admin/assign-supervisor', {
      method: 'POST',
      body: JSON.stringify({ studentId, supervisorId }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        alert("มอบหมายอาจารย์นิเทศสำเร็จ");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">รายชื่อนักศึกษา</th>
            <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">อาจารย์นิเทศที่รับผิดชอบ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {assignments.map((student: any) => (
            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-6">
                <p className="font-bold text-slate-800">{student.name}</p>
              </td>
              <td className="p-6">
                <select 
                  className="bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#2B4560]"
                  defaultValue={student.supervisorId || ""}
                  onChange={(e) => handleSelectSupervisor(student.id, e.target.value)}
                >
                  <option value="">-- เลือกอาจารย์นิเทศ --</option>
                  {supervisors.map((sv: any) => (
                    <option key={sv.id} value={sv.id}>{sv.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
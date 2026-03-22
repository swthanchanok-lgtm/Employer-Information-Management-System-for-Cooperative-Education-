'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, UserCircle, Loader2, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function StudentScoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentScores = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/instructor/scores'); 
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching student scores:", error);
      setStudents([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentScores();
  }, []);

  const filteredStudents = students.filter(student => 
    (student?.name || '').includes(searchQuery) || 
    (student?.studentId || student?.id || '').includes(searchQuery)
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2B4560] flex items-center gap-3">
            <ClipboardList className="text-blue-500" size={32} />
            คะแนนการประเมินนักศึกษา
          </h1>
          <p className="text-slate-400 font-bold mt-2">
            ตรวจสอบคะแนนจากแบบประเมินทั้งหมด (ฟอร์ม 1, 2 และ 3)
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
          <Download size={16} />
          Export คะแนน
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ รหัสนักศึกษา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium text-[#2B4560] outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-black whitespace-nowrap">นักศึกษา</th>
                <th className="p-4 font-black text-center whitespace-nowrap">ฟอร์ม 1<br/><span className="text-xs text-slate-400 font-normal">(แบบประเมิน 1)</span></th>
                <th className="p-4 font-black text-center whitespace-nowrap">ฟอร์ม 2<br/><span className="text-xs text-slate-400 font-normal">(อาจารย์นิเทศ)</span></th>
                {/* 🚩 เพิ่มหัวตารางฟอร์ม 3 ตรงนี้จ้า */}
                <th className="p-4 font-black text-center whitespace-nowrap">ฟอร์ม 3<br/><span className="text-xs text-slate-400 font-normal">(สถานประกอบการ)</span></th>
                <th className="p-4 font-black text-center whitespace-nowrap">คะแนนรวม</th>
                <th className="p-4 font-black text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  {/* 🚩 เปลี่ยน colSpan เป็น 6 เพราะเราเพิ่มคอลัมน์มา 1 อัน */}
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
                      <p className="font-bold">กำลังโหลดข้อมูลคะแนน...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id || student.studentId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserCircle className="text-slate-300" size={32} />
                        <div>
                          <p className="font-bold text-[#2B4560] text-sm">{student.name || 'ไม่ระบุชื่อ'}</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">{student.id || student.studentId} • {student.branch || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`font-black text-base ${student.form1Score ? 'text-[#2B4560]' : 'text-slate-300'}`}>
                        {student.form1Score !== null && student.form1Score !== undefined ? student.form1Score : '-'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`font-black text-base ${student.form2Score ? 'text-[#2B4560]' : 'text-slate-300'}`}>
                        {student.form2Score !== null && student.form2Score !== undefined ? student.form2Score : '-'}
                      </span>
                    </td>

                    {/* 🚩 เพิ่มช่องแสดงคะแนนฟอร์ม 3 ตรงนี้จ้า */}
                    <td className="p-4 text-center">
                      <span className={`font-black text-base ${student.form3Score ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {student.form3Score !== null && student.form3Score !== undefined ? student.form3Score : '-'}
                      </span>
                    </td>

                    <td className="p-4 text-center bg-blue-50/30">
                      <span className={`font-black text-lg ${student.totalScore ? 'text-blue-600' : 'text-slate-300'}`}>
                        {student.totalScore || '-'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <Link 
                        href={`/teachers/instructor/students/${student.id || student.studentId}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        title="ดูรายละเอียดการประเมิน"
                      >
                        <FileText size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* 🚩 เปลี่ยน colSpan เป็น 6 ตรงนี้ด้วยจ้า */}
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                    ไม่มีข้อมูลนักศึกษา
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
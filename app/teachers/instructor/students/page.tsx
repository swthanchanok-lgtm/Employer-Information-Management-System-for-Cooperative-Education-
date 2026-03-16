'use client';

import React, { useState, useEffect } from 'react';
import { Search, Award, FileText, Download, UserCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function StudentScoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 🚩 เพิ่ม State รอโหลดข้อมูล

  // 🚩 1. ฟังก์ชันดึงข้อมูลคะแนนจริงจาก API
  const fetchStudentScores = async () => {
    try {
      setIsLoading(true);
      
      // ⚠️ เปลี่ยน URL '/api/instructor/scores' ให้ตรงกับ API ที่แม่เขียนไว้นะคะ
      const res = await fetch('/api/instructor/scores'); 
      
      if (!res.ok) throw new Error('Failed to fetch data');
      
      const data = await res.json();
      setStudents(data); // เอาข้อมูลจริงยัดใส่ State
      
    } catch (error) {
      console.error("Error fetching student scores:", error);
      // ถ้า Error อาจจะเซ็ตค่าว่าง หรือแจ้งเตือน
      setStudents([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // 🚩 2. สั่งให้ดึงข้อมูลทันทีที่เปิดหน้านี้ขึ้นมา
  useEffect(() => {
    fetchStudentScores();
  }, []);

  // ค้นหานักศึกษา (ป้องกัน Error กรณีข้อมูลบางตัวเป็น null)
  const filteredStudents = students.filter(student => 
    (student?.name || '').includes(searchQuery) || 
    (student?.studentId || student?.id || '').includes(searchQuery)
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans animate-in fade-in duration-500">
      
      {/* ⚪️ 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2B4560] flex items-center gap-3">
            <Award className="text-amber-500" size={32} />
            สรุปคะแนนประเมินนักศึกษา
          </h1>
          <p className="text-slate-400 font-bold mt-2">
            ตรวจสอบคะแนนจากสถานประกอบการและอาจารย์นิเทศ เพื่อประมวลผลเกรด
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
          <Download size={16} />
          Export คะแนน (Excel)
        </button>
      </div>

      {/* ⚪️ 2. Search Bar */}
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

      {/* ⚪️ 3. Scores Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-black whitespace-nowrap">นักศึกษา</th>
                <th className="p-4 font-black text-center whitespace-nowrap">สถานประกอบการ<br/><span className="text-xs text-slate-400 font-normal">(เต็ม 50)</span></th>
                <th className="p-4 font-black text-center whitespace-nowrap">อาจารย์นิเทศ<br/><span className="text-xs text-slate-400 font-normal">(เต็ม 50)</span></th>
                <th className="p-4 font-black text-center whitespace-nowrap">คะแนนรวม<br/><span className="text-xs text-slate-400 font-normal">(เต็ม 100)</span></th>
                <th className="p-4 font-black text-center whitespace-nowrap">เกรด</th>
                <th className="p-4 font-black text-center whitespace-nowrap">สถานะ</th>
                <th className="p-4 font-black text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              
              {/* 🚩 แสดง Loading ตอนกำลังดึงข้อมูล */}
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="animate-spin mb-2 text-blue-500" size={32} />
                      <p className="font-bold">กำลังโหลดข้อมูลคะแนน...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id || student.studentId} className="hover:bg-slate-50/50 transition-colors group">
                    {/* ข้อมูลนักศึกษา */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserCircle className="text-slate-300" size={32} />
                        <div>
                          <p className="font-bold text-[#2B4560] text-sm">{student.name || 'ไม่ระบุชื่อ'}</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">{student.id || student.studentId} • {student.branch || '-'}</p>
                        </div>
                      </div>
                    </td>

                    {/* คะแนนสถานประกอบการ */}
                    <td className="p-4 text-center">
                      <span className={`font-black text-base ${student.companyScore ? 'text-[#2B4560]' : 'text-slate-300'}`}>
                        {student.companyScore !== null && student.companyScore !== undefined ? student.companyScore : '-'}
                      </span>
                    </td>

                    {/* คะแนนอาจารย์นิเทศ */}
                    <td className="p-4 text-center">
                      <span className={`font-black text-base ${student.supervisorScore ? 'text-[#2B4560]' : 'text-slate-300'}`}>
                        {student.supervisorScore !== null && student.supervisorScore !== undefined ? student.supervisorScore : '-'}
                      </span>
                    </td>

                    {/* คะแนนรวม */}
                    <td className="p-4 text-center bg-blue-50/30">
                      <span className={`font-black text-lg ${student.totalScore || student.total ? 'text-blue-600' : 'text-slate-300'}`}>
                        {student.totalScore || student.total || '-'}
                      </span>
                    </td>

                    {/* เกรด */}
                    <td className="p-4 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm
                        ${student.grade === 'A' ? 'bg-emerald-100 text-emerald-700' : 
                          student.grade === 'B+' || student.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          (!student.grade || student.grade === '-') ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-700'}`}>
                        {student.grade || '-'}
                      </div>
                    </td>

                    {/* สถานะ */}
                    <td className="p-4 text-center">
                      {student.status === 'COMPLETED' ? (
                        <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full tracking-wider">
                          ประเมินครบแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full tracking-wider">
                          รอผลประเมิน
                        </span>
                      )}
                    </td>

                    {/* ปุ่ม Action */}
                    <td className="p-4 text-center">
                      <Link 
                        href={`/teachers/instructor/students/${student.id || student.studentId}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        title="ดูรายละเอียดคะแนน"
                      >
                        <FileText size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
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
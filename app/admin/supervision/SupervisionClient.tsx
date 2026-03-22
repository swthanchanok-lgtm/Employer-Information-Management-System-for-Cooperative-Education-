'use client';
import React, { useState } from 'react';
import { Search, UserPlus, Users, CheckCircle2, Circle, Calendar, X, ChevronDown } from 'lucide-react';

export default function AdminSupervisionClient({ initialStudents, supervisors }: any) {
  const [students, setStudents] = useState(initialStudents || []);
  const [searchTerm, setSearchTerm] = useState('');

  // State สำหรับคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<any>(null);
  
  // State สำหรับ Modal
  const [tempTeacherIds, setTempTeacherIds] = useState<number[]>([]);
  const [tempDate, setTempDate] = useState<string>('');
  const [teacherSearch, setTeacherSearch] = useState('');

  // State เอาไว้จำว่าเด็กคนไหนกำลัง "กาง" รายชื่ออาจารย์ดูอยู่
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // ฟังก์ชันสลับ ยืด-หด รายชื่ออาจารย์
  const toggleTeacherList = (studentId: number) => {
    setExpandedRows(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId] 
    );
  };

  const openModal = (student: any) => {
    setActiveStudent(student);
    const currentTeacherIds = student.supervisionGroup?.instructors?.map((i: any) => i.id) || [];
    setTempTeacherIds(currentTeacherIds);
    
    const existingDate = student.supervisionGroup?.scheduledDate 
      ? new Date(student.supervisionGroup.scheduledDate).toISOString().split('T')[0] 
      : '';
    setTempDate(existingDate);
    
    setTeacherSearch('');
    setIsModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!activeStudent) return;
    
    try {
      const res = await fetch('/api/admin/assign-supervision-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId: activeStudent.id, 
          teacherIds: tempTeacherIds,
          scheduledDate: tempDate || null
        }),
      });

      if (res.ok) {
        const selectedInstructors = supervisors.filter((sv: any) => tempTeacherIds.includes(sv.id));
        setStudents(students.map((s: any) =>
          s.id === activeStudent.id 
            ? { 
                ...s, 
                supervisionGroup: { 
                  ...s.supervisionGroup, 
                  instructors: selectedInstructors,
                  scheduledDate: tempDate ? new Date(tempDate) : null
                } 
              } 
            : s
        ));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error assigning group:", error);
    }
  };

  const filteredStudents = students?.filter((s: any) =>
    s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.username?.includes(searchTerm)
  ) || [];

  const filteredTeachers = supervisors?.filter((sv: any) => 
    sv?.name?.toLowerCase().includes(teacherSearch.toLowerCase())
  ) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative"> 
      
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
          const currentTeachers = student.supervisionGroup?.instructors || [];
          const hasTeam = currentTeachers.length > 0;
          const scheduledDate = student.supervisionGroup?.scheduledDate;
          const isExpanded = expandedRows.includes(student.id);

          return (
            <div key={student.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="grid grid-cols-12 items-start md:items-center p-6 gap-4">
                
                {/* 1. ข้อมูลนักศึกษา */}
                <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                  <div className={`min-w-[48px] h-12 rounded-2xl flex items-center justify-center font-black text-lg ${hasTeam ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
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

                {/* 2. วันที่ + ปุ่มกางดูอาจารย์ */}
                <div className="col-span-12 md:col-span-4 border-l-0 md:border-l md:border-r border-slate-50 pt-4 md:pt-0 md:px-6">
                  <div className="flex flex-col gap-2.5">
                    
                    {/* 📅 โชว์วันที่นิเทศ */}
                    {scheduledDate ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-[#2B4560]">
                        <Calendar size={16} className="text-blue-500" />
                        <span>วันที่: {new Date(scheduledDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        <Calendar size={16} />
                        <span>ยังไม่ได้กำหนดวันนิเทศ</span>
                      </div>
                    )}

                    {/* 👥 ปุ่มกดดูกลุ่มอาจารย์ (แบบยืด-หด) */}
                    <div className="flex flex-col items-start gap-2">
                      <button 
                        onClick={() => toggleTeacherList(student.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors ${hasTeam ? 'bg-slate-50 text-[#2B4560] hover:bg-slate-100' : 'bg-rose-50 text-rose-500'}`}
                      >
                        <Users size={14} /> 
                        {hasTeam ? `ทีมอาจารย์ (${currentTeachers.length} ท่าน)` : 'ยังไม่ได้เลือกอาจารย์'}
                        {hasTeam && <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
                      </button>

                      {isExpanded && hasTeam && (
                        <div className="flex flex-wrap gap-1.5 mt-1 p-2.5 bg-slate-50 border border-slate-100 rounded-2xl w-full animate-in fade-in slide-in-from-top-2">
                          {currentTeachers.map((sv: any) => (
                            <span key={sv.id} className="px-2.5 py-1 bg-white text-[#2B4560] text-[10px] font-bold rounded-lg border border-slate-200 shadow-sm">
                              {sv.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* 3. ปุ่มเปิด Modal (ตัดสถานะออกแล้ว จัดให้อยู่ตรงกลางสวยๆ) */}
                <div className="col-span-12 md:col-span-3 flex justify-end items-center border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                   <button
                     onClick={() => openModal(student)}
                     className="w-full md:w-40 bg-[#2B4560] hover:bg-blue-600 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                   >
                     <Calendar size={14} /> จัดตาราง/ทีม
                   </button>
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

      {/* 🚀 Modal Component */}
      {isModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-[#2B4560]">จัดตารางนิเทศ</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">{activeStudent.name} {activeStudent.surname}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 text-slate-400 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-black text-[#2B4560] uppercase mb-2">กำหนดวันที่ไปนิเทศ</label>
                <input 
                  type="date" 
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2B4560] uppercase mb-2 flex justify-between items-end">
                  <span>เลือกทีมอาจารย์ (เลือกได้หลายคน)</span>
                  <span className="text-blue-500">{tempTeacherIds.length} คน</span>
                </label>
                
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="text"
                    placeholder="พิมพ์ค้นหาชื่ออาจารย์..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {filteredTeachers.map((sv: any) => {
                    const isSelected = tempTeacherIds.includes(sv.id);
                    return (
                      <button
                        key={sv.id}
                        onClick={() => {
                          setTempTeacherIds(prev => 
                            isSelected ? prev.filter(id => id !== sv.id) : [...prev, sv.id]
                          );
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all border-2 text-sm font-bold ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500 text-blue-700' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <span>{sv.name}</span>
                        {isSelected && <CheckCircle2 size={18} className="text-blue-500" />}
                      </button>
                    );
                  })}
                  {filteredTeachers.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-4 font-bold">ไม่พบชื่ออาจารย์</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSaveGroup}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-white bg-[#2B4560] hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> บันทึกข้อมูล
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
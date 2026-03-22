'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Info, User, Building2, Briefcase, MapPin, Phone, Banknote, X, Check } from 'lucide-react';

export default function InstructorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      // 🚩 ดึงข้อมูลทั้งหมด (อาจจะปรับ API ให้ดึงทั้ง PENDING, APPROVED, REJECTED ถ้าต้องการดูประวัติ)
      // แต่ในที่นี้บัวจะใช้วิธีอัปเดต State ภายในหน้าเพื่อแสดงผลหลังกดทันทีจ้ะ
      const res = await fetch('/api/instructor/applications');
      const json = await res.json();
      if (res.ok) setApplications(json.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT', studentId: number) => {
    const confirmMsg = action === 'APPROVE' ? "ยืนยันการ 'อนุมัติ' และเริ่มฝึกงานใช่หรือไม่?" : "ยืนยันการ 'ปฏิเสธ' ใช่หรือไม่?";
    if (!window.confirm(confirmMsg)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/instructor/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, studentId }) 
      });

      if (res.ok) {
        // 🚩 แก้ไข: อัปเดตสถานะใน State ทันทีเพื่อให้ UI เปลี่ยนป้าย ไม่ต้องหายไป
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : app
        ));
        setSelectedApp(null);
      } else {
        alert('เกิดข้อผิดพลาดในการทำรายการ');
      }
    } catch (error) {
      console.error("Action error:", error);
      alert('ระบบขัดข้องจ้าแม่');
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">กำลังโหลดข้อมูลคำร้อง...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[#F8FAFC] min-h-screen font-sans">
      <h1 className="text-3xl font-black text-[#2B4560] mb-2 flex items-center gap-3">
        <Clock className="text-blue-500" />
        รายการคำร้องขอฝึกงาน
      </h1>
      <p className="text-slate-500 mb-8 font-medium">จัดการคำร้องและตรวจสอบรายละเอียดนักศึกษาที่สมัครฝึกงาน</p>

      {applications.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
          <div className="mb-4 flex justify-center text-slate-200">
             <CheckCircle size={64} />
          </div>
          <p className="font-black text-xl">ไม่มีคำร้องค้างพิจารณาจ้าแม่ 🎉</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className={`bg-white p-6 rounded-[2.5rem] shadow-sm border transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md ${
                app.status === 'APPROVED' ? 'border-emerald-200 bg-emerald-50/20' : 
                app.status === 'REJECTED' ? 'border-red-200 bg-red-50/20' : 'border-slate-100'
              }`}
            >
              
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center gap-3 mb-3">
                  {/* แสดง Badge ตามสถานะ */}
                  {app.status === 'APPROVED' ? (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">อนุมัติแล้ว</span>
                  ) : app.status === 'REJECTED' ? (
                    <span className="bg-red-100 text-red-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">ปฏิเสธแล้ว</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">รอพิจารณา</span>
                  )}
                  
                  <span className="text-xs text-slate-400 font-bold">{new Date(app.createdAt).toLocaleDateString('th-TH')}</span>
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-black transition-colors"
                  >
                    <Info size={14} /> ดูรายละเอียด
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-800">
                  {app.student.prefix || ''}{app.student.name} {app.student.surname || ''}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-2">
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                    <Briefcase size={14} className="text-blue-500" /> {app.job.title}
                  </p>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" /> {app.establishment.name}
                  </p>
                </div>
              </div>

              {/* ปุ่มจัดการ: เปลี่ยนตามสถานะ */}
              <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                {app.status === 'APPROVED' ? (
                   <div className="flex-1 md:flex-none py-3 px-8 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                      <Check size={18} /> อนุมัติสำเร็จ
                   </div>
                ) : app.status === 'REJECTED' ? (
                   <div className="flex-1 md:flex-none py-3 px-8 bg-red-50 text-red-600 border border-red-200 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                      <XCircle size={18} /> ปฏิเสธแล้ว
                   </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleAction(app.id, 'APPROVE', app.studentId)} 
                      disabled={loadingId === app.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-green-100 disabled:opacity-50"
                    >
                      <CheckCircle size={20} /> อนุมัติ
                    </button>
                    <button 
                      onClick={() => handleAction(app.id, 'REJECT', app.studentId)} 
                      disabled={loadingId === app.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
                    >
                      <XCircle size={20} /> ปฏิเสธ
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL รายละเอียดคำร้อง */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden my-auto">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Info className="text-blue-500" /> รายละเอียดคำร้อง
                  </h2>
                  <p className="text-slate-400 font-bold text-sm mt-1">ข้อมูลประกอบการตัดสินใจ</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <section>
                  <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <User size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">ข้อมูลนักศึกษา</h4>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                    <p className="text-xl font-black text-slate-800">
                      {selectedApp.student.prefix}{selectedApp.student.name} {selectedApp.student.surname}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-50">คณะ{selectedApp.student.faculty}</span>
                        <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-50">สาขา{selectedApp.student.department}</span>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-emerald-600">
                        <Briefcase size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">ตำแหน่งงาน</h4>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-full">
                        <p className="font-black text-slate-700">{selectedApp.job.title}</p>
                        <p className="font-bold text-emerald-600 mt-1 flex items-center gap-1">
                            <Banknote size={14} /> ฿{selectedApp.job.salary?.toLocaleString() || '0'}
                        </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <Building2 size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">สถานประกอบการ</h4>
                    </div>
                    <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-lg h-full">
                        <p className="font-black truncate">{selectedApp.establishment.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-2">
                             <Phone size={10} /> {selectedApp.establishment.contact}
                        </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* ปุ่ม Action ภายใน Modal (ซ่อนถ้าจัดการไปแล้ว) */}
              {(!selectedApp.status || selectedApp.status === 'PENDING') && (
                <div className="flex gap-4 mt-10 pt-8 border-t border-slate-100">
                  <button 
                    onClick={() => handleAction(selectedApp.id, 'APPROVE', selectedApp.studentId)}
                    className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                  >
                    อนุมัติคำร้อง
                  </button>
                  <button 
                    onClick={() => handleAction(selectedApp.id, 'REJECT', selectedApp.studentId)}
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
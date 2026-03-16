'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Info, User, Building2, Briefcase, MapPin, Phone, Banknote, X } from 'lucide-react';

export default function InstructorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null); // 🚩 State สำหรับเปิดดูรายละเอียด

  const fetchApplications = async () => {
    try {
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

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
    const confirmMsg = action === 'APPROVE' ? "ยืนยันการ 'อนุมัติ' ใช่หรือไม่?" : "ยืนยันการ 'ปฏิเสธ' ใช่หรือไม่?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/instructor/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        alert(action === 'APPROVE' ? '✅ อนุมัติสำเร็จ!' : '❌ ปฏิเสธคำร้องแล้ว');
        setSelectedApp(null); // ปิด Modal
        fetchApplications();
      } else {
        alert('เกิดข้อผิดพลาดในการทำรายการ');
      }
    } catch (error) {
      console.error("Action error:", error);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-black text-[#2B4560] mb-8 flex items-center gap-3">
        <Clock className="text-blue-500" />
        รายการคำร้องขอฝึกงาน (รออนุมัติ)
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200 text-slate-400">
          🎉 ไม่มีคำร้องค้างพิจารณาจ้าแม่
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">รอพิจารณา</span>
                  <span className="text-xs text-slate-400 font-bold">{new Date(app.createdAt).toLocaleDateString('th-TH')}</span>
                  {/* 🚩 ปุ่มกดดูรายละเอียด */}
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-black transition-colors"
                  >
                    <Info size={14} /> ดูรายละเอียดคำร้อง
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-800">
                  {app.student.prefix || ''}{app.student.name} {app.student.surname || ''}
                </h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  <span className="text-blue-600 font-bold">📍 งาน:</span> {app.job.title} <br/>
                  <span className="text-blue-600 font-bold">🏢 บริษัท:</span> {app.establishment.name}
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => handleAction(app.id, 'APPROVE')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-green-200">
                  <CheckCircle size={20} /> อนุมัติ
                </button>
                <button onClick={() => handleAction(app.id, 'REJECT')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 px-8 py-4 rounded-2xl font-black transition-all active:scale-95">
                  <XCircle size={20} /> ปฏิเสธ
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 🚩 Modal รายละเอียดแบบจัดเต็ม (นักศึกษา + งาน + บริษัท) */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden my-auto">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Info className="text-blue-500" /> รายละเอียดคำร้อง
                </h2>
                <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. ข้อมูลนักศึกษา */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-blue-600">
                    <User size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">ข้อมูลนักศึกษา</h4>
                  </div>
                  <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
                    <p className="text-lg font-black text-slate-800">
                      {selectedApp.student.prefix}{selectedApp.student.name} {selectedApp.student.surname}
                    </p>
                    <p className="text-sm text-slate-500 font-bold mt-1">
                      คณะ{selectedApp.student.faculty} • สาขา{selectedApp.student.department}
                    </p>
                  </div>
                </section>

                {/* 2. รายละเอียดงาน */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <Briefcase size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">ตำแหน่งงานที่สมัคร</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ตำแหน่ง</p>
                      <p className="font-black text-slate-700">{selectedApp.job.title}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                        <Banknote size={12} /> เงินเดือน/เบี้ยเลี้ยง
                      </p>
                      <p className="font-black text-slate-700">฿{selectedApp.job.salary?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </section>

                {/* 3. รายละเอียดบริษัท */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Building2 size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">ข้อมูลสถานประกอบการ</h4>
                  </div>
                  <div className="bg-slate-800 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                    <p className="text-xl font-black">{selectedApp.establishment.name}</p>
                    <div className="space-y-2 text-sm text-slate-300 font-medium">
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="text-red-400 shrink-0" /> {selectedApp.establishment.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-400 shrink-0" /> {selectedApp.establishment.contact}
                      </p>
                    </div>
                  </div>
                </section>

              </div>

              {/* ปุ่ม Action ด้านล่าง Modal */}
              <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleAction(selectedApp.id, 'APPROVE')}
                  className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                >
                  อนุมัติคำร้อง
                </button>
                <button 
                  onClick={() => handleAction(selectedApp.id, 'REJECT')}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                >
                  ปฏิเสธ
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
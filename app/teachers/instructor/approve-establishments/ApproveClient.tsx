'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Check, X, ArrowLeft, Clock, Info, Briefcase, Phone } from 'lucide-react';
import Link from 'next/link';

export default function ApproveClient({ initialData, userRole }: { initialData: any[], userRole: string }) {
  const router = useRouter();
  const [establishments, setEstablishments] = useState(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  
  // 🚩 เพิ่ม State สำหรับเก็บข้อมูลบริษัทที่เลือกดู
  const [selectedEst, setSelectedEst] = useState<any | null>(null);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ ${newStatus === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'} สถานประกอบการนี้?`)) return;
    
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/establishments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEstablishments(prev => prev.filter(est => est.id !== id));
        setSelectedEst(null); // ปิด Modal ถ้าเปิดอยู่
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (error) {
      console.error(error);
      alert('ระบบขัดข้อง กรุณาลองใหม่');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href={userRole === "ADMIN" ? "/admin/dashboard" : "/dashboard"} 
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">อนุมัติสถานประกอบการ</h1>
            <p className="text-sm text-slate-500 font-medium">ตรวจสอบและอนุมัติสถานที่ฝึกงานที่ถูกเสนอเข้ามาใหม่</p>
          </div>
        </div>

        {/* รายการบริษัท */}
        {establishments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">ไม่มีรายการค้าง</h3>
            <p className="text-slate-500 text-sm">สถานประกอบการทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {establishments.map((est) => (
              <div key={est.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-slate-800">{est.name}</h2>
                        {/* 🚩 ปุ่มดูรายละเอียด (ไอคอนเล็กๆ) */}
                        <button 
                          onClick={() => setSelectedEst(est)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ดูรายละเอียดเพิ่มเติม"
                        >
                          <Info size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-2">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">{est.category}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> เสนอเมื่อ: {new Date(est.createdAt).toLocaleDateString('th-TH')}</span>
                    </div>
                    <p className="text-sm text-slate-600 flex items-start gap-1.5 mt-3">
                      <MapPin size={16} className="text-red-400 shrink-0 mt-0.5" />
                      {est.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto border-t border-slate-100 pt-4 md:border-0 md:pt-0">
                  <button 
                    onClick={() => handleUpdateStatus(est.id, 'APPROVED')}
                    disabled={loadingId === est.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                  >
                    {loadingId === est.id ? 'กำลังบันทึก...' : <><Check size={18} /> อนุมัติ</>}
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(est.id, 'REJECTED')}
                    disabled={loadingId === est.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <X size={18} /> ปฏิเสธ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🚩 MODAL รายละเอียด (จะเด้งเมื่อมีค่าใน selectedEst) */}
        {selectedEst && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
              <div className="p-8">
                {/* หัวข้อ Modal */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
                      <Building2 size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedEst.name}</h2>
                      <p className="text-blue-600 font-bold text-sm">{selectedEst.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEst(null)}
                    className="p-2 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* ข้อมูลการติดต่อ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Phone size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">ข้อมูลการติดต่อ</span>
                      </div>
                      <p className="font-bold text-slate-700">{selectedEst.contact || 'ไม่ได้ระบุ'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">สถานที่ตั้ง</span>
                      </div>
                      <p className="font-bold text-slate-700 text-sm">{selectedEst.address}</p>
                    </div>
                  </div>

                  {/* รายละเอียดเพิ่มเติม */}
                  {selectedEst.description && (
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">รายละเอียดบริษัท</p>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{selectedEst.description}</p>
                    </div>
                  )}

                  {/* 🚩 รายชื่อตำแหน่งงาน (Jobs) */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase size={18} className="text-slate-800" />
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">ตำแหน่งงานที่เปิดรับ</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedEst.jobs && selectedEst.jobs.length > 0 ? (
                        selectedEst.jobs.map((job: any) => (
                          <div key={job.id} className="p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-blue-100 transition-all group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{job.title}</p>
                                    <div className="flex gap-2 mt-1">
                                        {job.hasShuttle && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">มีรถรับส่ง</span>}
                                        {job.hasDorm && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">มีหอพัก</span>}
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-400">฿{job.salary.toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-slate-400 text-sm italic font-medium">ยังไม่มีข้อมูลตำแหน่งงานที่ระบุ</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ปุ่ม Action ภายใน Modal */}
                <div className="flex gap-4 mt-8 border-t pt-6 border-slate-100">
                    <button 
                        onClick={() => handleUpdateStatus(selectedEst.id, 'APPROVED')}
                        className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                    >
                        อนุมัติทันที
                    </button>
                    <button 
                        onClick={() => handleUpdateStatus(selectedEst.id, 'REJECTED')}
                        className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                        ปฏิเสธ
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Check, X, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ApproveClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [establishments, setEstablishments] = useState(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // ฟังก์ชันจัดการการกดปุ่ม
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
        // เอาบริษัทที่กดแล้วออกจากหน้าจอ
        setEstablishments(prev => prev.filter(est => est.id !== id));
        router.refresh(); // รีเฟรชข้อมูลเบื้องหลัง
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
          <Link href="/admin/dashboard" className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition">
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
                
                {/* ข้อมูลบริษัท */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">{est.name}</h2>
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

                {/* ปุ่ม Action */}
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

      </div>
    </div>
  );
}
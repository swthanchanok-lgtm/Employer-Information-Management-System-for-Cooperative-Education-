'use client';
import React, { useEffect, useState } from 'react';
import { Check, X, Info, Briefcase, Banknote, Car, Building, Tag } from 'lucide-react';

export default function TeacherApproveJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null); // 🚩 State สำหรับเปิด Modal

  const fetchPendingJobs = async () => {
    try {
      const res = await fetch('/api/jobs?status=PENDING');
      if (!res.ok) throw new Error('เรียกข้อมูลไม่สำเร็จ'); 
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (jobId: number, newStatus: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ ${newStatus === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'} ตำแหน่งงานนี้?`)) return;
    
    try {
      const res = await fetch(`/api/jobs/${jobId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert(newStatus === 'APPROVED' ? 'อนุมัติงานแล้วจ้าแม่!' : 'ปฏิเสธงานแล้วค่ะ');
        setSelectedJob(null); // ปิด Modal หลังจากกดอนุมัติ
        fetchPendingJobs();
      } else {
        const errorData = await res.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้จ้า");
    }
  };

  useEffect(() => { fetchPendingJobs(); }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-left">
      <h1 className="text-2xl font-black mb-6 text-[#2B4560]">อนุมัติตำแหน่งงาน</h1>
      
      <div className="grid gap-4">
        {jobs.length > 0 ? (
          jobs.map((job: any) => (
            <div key={job.id} className="bg-white p-6 rounded-3xl shadow-sm flex justify-between items-center border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Briefcase size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                    {/* 🚩 ปุ่มกดดูรายละเอียด */}
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">{job.establishment?.name || 'ไม่ระบุชื่อบริษัท'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleApprove(job.id, 'APPROVED')} className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 shadow-md active:scale-90"><Check size={20} /></button>
                <button onClick={() => handleApprove(job.id, 'REJECTED')} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-md active:scale-90"><X size={20} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase italic">ไม่มีงานที่รออนุมัติในขณะนี้จ้าแม่</p>
          </div>
        )}
      </div>

      {/* 🚩 Modal รายละเอียดงาน */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">รายละเอียดตำแหน่งงาน</h2>
                <button onClick={() => setSelectedJob(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* ข้อมูลหลัก */}
                <div className="bg-blue-50 p-6 rounded-3xl">
                  <p className="text-blue-600 font-black text-xl mb-1">{selectedJob.title}</p>
                  <p className="text-slate-600 font-bold flex items-center gap-1.5">
                    <Building size={16} /> {selectedJob.establishment?.name}
                  </p>
                </div>

                {/* รายละเอียดเงินเดือนและสวัสดิการ */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Banknote size={14} /> เงินเดือน/เบี้ยเลี้ยง
                    </p>
                    <p className="font-black text-slate-700">฿{selectedJob.salary?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Tag size={14} /> แท็ก/หมวดหมู่
                    </p>
                    <p className="font-black text-slate-700">{selectedJob.tags || '-'}</p>
                  </div>
                </div>

                {/* สวัสดิการพิเศษ */}
                <div className="flex gap-3">
                  <div className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm ${selectedJob.hasShuttle ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
                    <Car size={18} /> {selectedJob.hasShuttle ? 'มีรถรับส่ง' : 'ไม่มีรถรับส่ง'}
                  </div>
                  <div className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm ${selectedJob.hasDorm ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
                    <Building size={18} /> {selectedJob.hasDorm ? 'มีหอพัก' : 'ไม่มีหอพัก'}
                  </div>
                </div>

                {/* ปุ่มจัดการภายใน Modal */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => handleApprove(selectedJob.id, 'APPROVED')}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all"
                  >
                    อนุมัติงาน
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedJob.id, 'REJECTED')}
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
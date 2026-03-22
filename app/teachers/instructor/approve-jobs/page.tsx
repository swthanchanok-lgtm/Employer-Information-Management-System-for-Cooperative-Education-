'use client';
import React, { useEffect, useState } from 'react';
import { Check, X, Info, Briefcase, Banknote, Car, Building, Tag, Clock } from 'lucide-react';

export default function TeacherApproveJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

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

  const handleUpdateStatus = async (jobId: number, newStatus: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ ${newStatus === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'} ตำแหน่งงานนี้?`)) return;
    
    setLoadingId(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // 🚩 หัวใจสำคัญ: อัปเดตสถานะใน State แทนการลบทิ้ง
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
        setSelectedJob(null); 
      } else {
        const errorData = await res.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้จ้า");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => { fetchPendingJobs(); }, []);

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-left">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-2 text-[#2B4560]">อนุมัติตำแหน่งงาน</h1>
        <p className="text-slate-500 mb-8 font-medium">ตรวจสอบและคัดกรองตำแหน่งงานที่สถานประกอบการเสนอเข้ามา</p>
        
        <div className="grid gap-6">
          {jobs.length > 0 ? (
            jobs.map((job: any) => (
              <div 
                key={job.id} 
                className={`bg-white p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border transition-all duration-300 ${
                  job.status === 'APPROVED' ? 'border-emerald-200 bg-emerald-50/20' : 
                  job.status === 'REJECTED' ? 'border-red-200 bg-red-50/20' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`p-5 rounded-3xl transition-colors ${
                    job.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                    job.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-xl text-slate-800">{job.title}</h3>
                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-xl transition-colors"
                      >
                        <Info size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center text-sm font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Building size={14} /> {job.establishment?.name || 'ไม่ระบุบริษัท'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className="flex items-center gap-1 text-blue-500/70"><Banknote size={14} /> ฿{job.salary?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  {job.status === 'APPROVED' ? (
                    <div className="flex-1 md:flex-none py-3 px-8 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                      <Check size={18} /> อนุมัติแล้ว
                    </div>
                  ) : job.status === 'REJECTED' ? (
                    <div className="flex-1 md:flex-none py-3 px-8 bg-red-50 text-red-600 border border-red-200 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                      <X size={18} /> ปฏิเสธแล้ว
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(job.id, 'APPROVED')} 
                        disabled={loadingId === job.id}
                        className="flex-1 md:flex-none p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Check size={22} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(job.id, 'REJECTED')} 
                        disabled={loadingId === job.id}
                        className="flex-1 md:flex-none p-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <X size={22} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Clock size={40} />
              </div>
              <p className="text-slate-400 font-black text-lg">ไม่มีงานที่รออนุมัติในขณะนี้</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL รายละเอียดงาน */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">รายละเอียดงาน</h2>
                  <p className="text-blue-500 font-bold text-sm mt-1">ตรวจสอบข้อมูลก่อนตัดสินใจ</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-blue-600 font-black text-2xl mb-1">{selectedJob.title}</p>
                  <p className="text-slate-500 font-bold flex items-center gap-2">
                    <Building size={18} className="text-slate-300" /> {selectedJob.establishment?.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border-2 border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Banknote size={14} /> เบี้ยเลี้ยงต่อเดือน
                    </p>
                    <p className="font-black text-xl text-slate-700">฿{selectedJob.salary?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border-2 border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Tag size={14} /> หมวดหมู่
                    </p>
                    <p className="font-black text-slate-700">{selectedJob.tags || 'ทั่วไป'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm border-2 ${selectedJob.hasShuttle ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                    <Car size={20} /> {selectedJob.hasShuttle ? 'มีรถรับส่ง' : 'ไม่มีรถรับส่ง'}
                  </div>
                  <div className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm border-2 ${selectedJob.hasDorm ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                    <Building size={20} /> {selectedJob.hasDorm ? 'มีหอพัก' : 'ไม่มีหอพัก'}
                  </div>
                </div>

                {/* ปุ่มจัดการภายใน Modal (ซ่อนถ้าจัดการไปแล้ว) */}
                {(!selectedJob.status || selectedJob.status === 'PENDING') && (
                  <div className="flex gap-4 mt-10 pt-8 border-t border-slate-50">
                    <button 
                      onClick={() => handleUpdateStatus(selectedJob.id, 'APPROVED')}
                      className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      อนุมัติงาน
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedJob.id, 'REJECTED')}
                      className="flex-1 bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
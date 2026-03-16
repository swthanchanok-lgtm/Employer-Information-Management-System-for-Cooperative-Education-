'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter,useParams } from 'next/navigation';
import { Building2, MapPin, ArrowLeft, Info, BadgeDollarSign, Bus, Home } from 'lucide-react';

export default function StudentJobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  

  useEffect(() => {
    // 🔍 ดึงข้อมูลจาก API ตัวที่แม่เพิ่งเพิ่ม GET เข้าไปจ้า
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error("Error:", err));
  }, [id]);

  if (!job) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">กำลังดึงข้อมูลงานให้คุณธัญชนกนะจ๊ะ...</div>;

  const handleApplyJob = async () => {
    // 1. ถามเพื่อความชัวร์ก่อนกด
    const confirmApply = window.confirm(`คุณต้องการยื่นคำร้องขอฝึกงานในตำแหน่ง ${job.title} ใช่หรือไม่?\n\n*หากยื่นแล้วสถานะจะเปลี่ยนเป็น "รออนุมัติ" ทันที`);
    if (!confirmApply) return;

    try {
      setIsApplying(true);
      
      // 2. ยิง API ไปสร้างคำร้อง (สมมติว่าสร้าง API ไว้ที่ /api/student/apply)
      const res = await fetch('/api/student/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          establishmentId: job.establishment?.id
          // 💡 ปกติ Student ID จะดึงจาก Session (ผู้ที่ล็อกอินอยู่) ที่ฝั่ง Backend จ้า
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 ยื่นคำร้องสำเร็จ! กรุณารออาจารย์ตรวจสอบอนุมัติจ้า");
        // 3. ยื่นเสร็จปุ๊บ เด้งกลับไปหน้า Dashboard ให้เด็กดูสถานะ "รออนุมัติ"
        router.push('/student/dashboard'); 
      } else {
        alert(`❌ ยื่นไม่สำเร็จ: ${data.error}`);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) return <div className="p-20 text-center animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-left">
      <div className="max-w-4xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8 hover:text-[#2B4560] transition-colors">
          <ArrowLeft size={16} /> กลับสู่หน้าแดชบอร์ด
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header งาน */}
          <div className="p-8 md:p-12 border-b border-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4">
                  ตำแหน่งงานที่เปิดรับ
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-[#2B4560] leading-tight mb-4">{job.title}</h1>
                <p className="text-xl text-slate-400 font-bold flex items-center gap-2">
                  <Building2 className="text-slate-300" /> {job.establishment?.name}
                </p>
              </div>
              <div className="w-24 h-24 rounded-3xl border-4 border-slate-50 overflow-hidden shadow-inner">
                 <img src={job.establishment?.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* 🚩 ปุ่มยื่นคำร้องของแม่มาแล้วจ้า! */}
              <button 
                onClick={handleApplyJob}
                disabled={isApplying}
                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2
                  ${isApplying 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95 shadow-green-500/30'
                  }`}
              >
                {isApplying ? '⏳ กำลังยื่นคำร้อง...' : '✨ ยื่นคำร้องขอฝึกงาน'}
              </button>
            
          

          <div className="p-8 md:p-12">
            {/* รายละเอียดเงินเดือน & สวัสดิการ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <DetailBox icon={<BadgeDollarSign className="text-emerald-500"/>} label="ค่าตอบแทน" value={`${job.salary?.toLocaleString()} บาท / เดือน`} color="bg-emerald-50" />
               <DetailBox icon={<Bus className="text-blue-500"/>} label="รถรับส่ง" value={job.hasShuttle ? "มีบริการรถรับส่ง" : "ไม่มีบริการ"} color="bg-blue-50" />
               <DetailBox icon={<Home className="text-purple-500"/>} label="ที่พัก" value={job.hasDorm ? "มีหอพักให้" : "ไม่มีหอพัก"} color="bg-purple-50" />
            </div>

            {/* รายละเอียดงาน */}
            <div className="mb-12">
              <h3 className="text-lg font-black text-[#2B4560] mb-4 flex items-center gap-2">
                <Info size={22} className="text-blue-500" /> รายละเอียดงานและคุณสมบัติ
              </h3>
              <div className="bg-slate-50 p-8 rounded-[2rem] text-slate-600 leading-relaxed font-medium">
                {job.description || "บริษัทนี้ยังไม่ได้ระบุรายละเอียดงานเพิ่มเติมจ้าแม่"}
              </div>
            </div>

            {/* ส่วนเชื่อมต่อไปยังหน้าบริษัท (Highlight) */}
            <div className="bg-[#2B4560] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/10">
               <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">สนใจข้อมูลบริษัทเพิ่มเติม?</p>
                  <h4 className="text-2xl font-bold">ข้อมูลของ {job.establishment?.name}</h4>
                  <p className="text-blue-200 text-sm mt-1">ดูสถานที่ตั้ง, หมวดหมู่ และรีวิวบริษัทนี้</p>
               </div>
               {/* 🚩 ปุ่มกดไปหน้าบริษัท */}
               <Link href={`/establishments/${job.establishment?.id}`}>
                  <button className="bg-white text-[#2B4560] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                     <Building2 size={18} /> ดูโปรไฟล์บริษัท
                  </button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component ย่อยจะได้ดูสะอาดตาจ้าแม่
const DetailBox = ({ icon, label, value, color }: any) => (
  <div className={`${color} p-6 rounded-3xl border border-white shadow-sm`}>
    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="font-bold text-[#2B4560]">{value}</p>
  </div>
);
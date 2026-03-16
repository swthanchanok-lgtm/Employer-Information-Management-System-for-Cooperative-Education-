'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// ✅ รวม import ไว้ที่เดียวกันให้เรียบร้อยจ้า
import { 
  Building2, MapPin, Phone, Globe, 
  ArrowLeft, Briefcase, Info, ArrowRight 
} from 'lucide-react';

export default function EstablishmentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/establishments/${id}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [id]);

  if (!data) return <div className="p-20 text-center font-black text-slate-400">กำลังโหลดโปรไฟล์บริษัท...</div>;

  return (
    // 🚩 ลบ overflow-hidden ออก (ถ้ามี) เพื่อให้เลื่อนเมาส์ได้ลื่นๆ จ้า
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Header Image - ใช้ h-32 เป็นค่ามาตรฐานจ้าแม่ */}
      <div className="h-32 bg-[#2B4560] relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-8 left-8 bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/20 transition-all z-20"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* เนื้อหาหลัก - ใช้ -mt-16 ตามที่แม่แก้มาคือเลิศแล้วจ้า */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-20 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* ข้อมูลพื้นฐาน */}
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white shadow-xl -mt-20 overflow-hidden bg-white flex-shrink-0">
              <img 
                src={data.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"} 
                className="w-full h-full object-cover" 
                alt="Logo"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                {data.category || "General"}
              </span>
              <h1 className="text-4xl font-black text-[#2B4560] mb-2">{data.name}</h1>
              <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2">
                <MapPin size={18} /> {data.address}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* ฝั่งซ้าย: รายละเอียดบริษัท */}
            <div className="md:col-span-2 p-8 md:p-12 border-r border-slate-50">
              <h3 className="text-xl font-black text-[#2B4560] mb-6 flex items-center gap-2">
                <Info className="text-blue-500" /> เกี่ยวกับบริษัท
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-10 whitespace-pre-line">
                {data.description || "ไม่มีข้อมูลคำอธิบายบริษัท"}
              </p>

              {/* แสดงรายการงานที่เปิดรับ */}
              <h3 className="text-xl font-black text-[#2B4560] mb-6 flex items-center gap-2">
                <Briefcase className="text-emerald-500" /> ตำแหน่งงานที่เปิดรับ
              </h3>
              <div className="grid gap-4">
                {data.jobs?.map((job: any) => (
                  <div key={job.id} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center group hover:bg-[#2B4560] transition-all cursor-pointer" 
                       onClick={() => router.push(`/student/jobs/${job.id}`)}>
                    <div>
                      <p className="font-black text-[#2B4560] group-hover:text-white transition-colors">{job.title}</p>
                      <p className="text-xs text-slate-400 group-hover:text-blue-200">💰 {job.salary?.toLocaleString()} บาท/เดือน</p>
                    </div>
                    <div className="bg-white text-[#2B4560] p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
                {(!data.jobs || data.jobs.length === 0) && (
                  <p className="text-slate-400 text-sm italic">ยังไม่มีตำแหน่งงานที่เปิดรับในขณะนี้</p>
                )}
              </div>
            </div>

            {/* ฝั่งขวา: ช่องทางติดต่อ */}
            <div className="p-8 md:p-12 bg-slate-50/50">
              <h3 className="text-lg font-black text-[#2B4560] mb-6">ข้อมูลติดต่อ</h3>
              <div className="space-y-6">
                <ContactItem icon={<Phone size={20}/>} label="เบอร์โทรศัพท์" value={data.contact || "ไม่ได้ระบุ"} />
                <ContactItem icon={<Globe size={20}/>} label="แผนที่ / เว็บไซต์" value={data.mapUrl ? "คลิกเพื่อดูแผนที่" : "ไม่ได้ระบุ"} link={data.mapUrl} />
              </div>

              <div className="mt-12 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">สมัครฝึกงานที่นี่?</p>
                 <button className="w-full py-4 bg-[#2B4560] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    ยื่นคำร้องฝึกงาน
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContactItem = ({ icon, label, value, link }: any) => (
  <div className="flex items-start gap-4">
    <div className="text-blue-500 mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">{value}</a>
      ) : (
        <p className="text-sm font-bold text-[#2B4560]">{value}</p>
      )}
    </div>
  </div>
);
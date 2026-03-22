'use client'; 

import Link from 'next/link';
import { MapPin, Building2, Banknote, Sparkles, ChevronRight, Star } from 'lucide-react'; // 🚩 เพิ่ม Star ตรงนี้จ้า

// --- ส่วนกำหนด Type ---
interface Job {
  id: string | number;
  title: string;
  salary: number;
  tags?: string | null;
}

interface Establishment {
  id: string | number;
  name: string;
  address?: string | null;
  province?: string | null;
  imageUrl?: string | null;
  averageRating?: number; // 🚩 เพิ่ม field คะแนนเฉลี่ย
  jobs?: Job[];
}

interface EstablishmentListProps {
  establishments?: Establishment[];
  searchQuery?: string;
}

export default function EstablishmentList({ establishments, searchQuery = '' }: EstablishmentListProps) {
  
  const safeEstablishments = establishments || [];

  const allJobs = safeEstablishments.flatMap(est => 
    (est.jobs || []).map(job => ({
      ...job,
      establishment: {
        id: est.id,
        name: est.name,
        address: est.address,
        province: est.province,
        imageUrl: est.imageUrl,
        averageRating: est.averageRating // 🚩 ส่งคะแนนเฉลี่ยมาด้วยจ้า
      }
    }))
  );

  const filteredJobs = allJobs.filter((item) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true;
    const matchTitle = item.title?.toLowerCase().includes(search);
    const matchCompany = item.establishment.name?.toLowerCase().includes(search);
    const matchProvince = item.establishment.province?.toLowerCase().includes(search);
    return matchTitle || matchCompany || matchProvince;
  });

  return (
    <div className="w-full">
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-bold">ไม่พบตำแหน่งงาน {searchQuery && `ที่ตรงกับ "${searchQuery}"`} จ้าแม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((item) => (
            <div key={`${item.establishment.id}-${item.id}`} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
              
              {/* 1. ส่วนรูปภาพบริษัท */}
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                {item.establishment.imageUrl ? (
                  <img 
                    src={item.establishment.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Building2 size={48} />
                  </div>
                )}

                {/* 🌟 🚩 ส่วนคะแนนดาว (เช็คเงื่อนไข: ถ้าคะแนน > 0 ถึงจะขึ้น) */}
                {item.establishment.averageRating && item.establishment.averageRating > 0 && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-yellow-100 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[#2B4560] text-xs font-black">
                      {item.establishment.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Tag เงินเดือน */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-sm border border-emerald-100">
                  <span className="text-emerald-600 text-xs font-black">
                    {item.salary > 0 ? `฿${item.salary.toLocaleString()}` : 'รายได้ดี'}
                  </span>
                </div>
              </div>

              {/* 2. ส่วนเนื้อหา */}
              <div className="p-7 flex-1 flex flex-col">
                <h3 className="font-black text-xl text-[#2B4560] mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {item.title}
                </h3>

                <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-400" /> {item.establishment.name}
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <MapPin size={16} className="text-rose-400 shrink-0" />
                    <span className="truncate">{item.establishment.province || item.establishment.address || "ไม่ระบุที่อยู่"}</span>
                  </div>
                </div>

                {/* 3. ปุ่ม Action */}
                <div className="mt-auto space-y-3">
                  <Link 
                    href={`/student/jobs/${item.id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#2B4560] text-white hover:bg-blue-600 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/10 active:scale-95"
                  >
                    ดูรายละเอียดงาน <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
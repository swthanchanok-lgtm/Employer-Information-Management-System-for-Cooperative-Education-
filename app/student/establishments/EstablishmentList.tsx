'use client'; 

import Link from 'next/link';

// --- ส่วนกำหนด Type (Interface) ---
interface Job {
  id: string | number;
  title: string;
  salary: number;
  tags?: string | null; // เผื่อ tags เป็น null
}

interface Establishment {
  id: string | number;
  name: string;
  // ✅ แก้ไข: เพิ่ม | null เพื่อให้รับค่าว่างจาก Database ได้โดยไม่ Error
  address?: string | null;
  province?: string | null;
  imageUrl?: string | null;
  jobs?: Job[];
}

interface EstablishmentListProps {
  establishments?: Establishment[];
  searchQuery?: string; // 🚩 1. เพิ่มบรรทัดนี้ เพื่อรับคำค้นหาจากหน้าหลัก
}

// 🚩 2. รับตัวแปร searchQuery เข้ามาใช้งาน (ถ้าไม่มีค่าให้เป็นช่องว่าง)
export default function EstablishmentList({ establishments, searchQuery = '' }: EstablishmentListProps) {
  
  // ✅ สร้างตัวแปรที่ปลอดภัย (ถ้าส่งมาเป็น null ให้ถือว่าเป็นอาเรย์ว่าง [])
  const safeEstablishments = establishments || [];

  // 🚩 3. เพิ่มระบบกรองข้อมูล (Filter) ตามคำค้นหา
  const filteredEstablishments = safeEstablishments.filter((est) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true; // ถ้าไม่ได้พิมพ์อะไร ให้แสดงทั้งหมด

    const matchName = est.name?.toLowerCase().includes(search);
    const matchProvince = est.province?.toLowerCase().includes(search);
    const matchAddress = est.address?.toLowerCase().includes(search);
    const matchJob = est.jobs?.some(job => job.title?.toLowerCase().includes(search));

    return matchName || matchProvince || matchAddress || matchJob;
  });

  return (
    <div className="w-full">
      
      {/* --- ส่วนแสดงรายชื่อบริษัท --- */}
      {/* 🚩 4. เปลี่ยนมาใช้ filteredEstablishments ในการแสดงผลแทนอันเดิม */}
      {filteredEstablishments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
          ไม่พบข้อมูลสถานประกอบการ {searchQuery && `ที่ตรงกับ "${searchQuery}"`}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEstablishments.map((est) => (
            <div key={est.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              
              {/* 1. ส่วนรูปภาพ */}
              <div className="h-48 w-full bg-gray-100 relative">
                  {est.imageUrl ? (
                    <img 
                        src={est.imageUrl} 
                        alt={est.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} // ซ่อนถ้ารูปเสีย
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                        <span className="text-4xl mb-2">🏢</span>
                        <span className="text-sm">ไม่มีรูปภาพ</span>
                    </div>
                  )}
              </div>

              {/* 2. ส่วนเนื้อหา */}
              <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-1" title={est.name}>
                      {est.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      📍 {est.province || est.address || "ไม่ระบุที่อยู่"}
                  </p>
                  
                  {/* 3. ส่วนแสดงตำแหน่งงาน (Jobs) */}
                  <div className="mt-auto space-y-2">
                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ตำแหน่งที่เปิดรับ:</p>
                     
                     {est.jobs && est.jobs.length > 0 ? (
                        est.jobs.map(job => (
                            /* 🚩 ทางเลือกที่ 1: ย้าย Link มาครอบตรงนี้เพื่อให้รู้จัก job */
                            <Link key={job.id} href={`/student/jobs/${job.id}`} className="block group">
                                <div className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex flex-col w-2/3">
                                        <span className="font-bold text-blue-700 truncate group-hover:text-blue-800">
                                            {job.title}
                                        </span>
                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">
                                            คลิกดูรายละเอียด
                                        </span>
                                    </div>
                                    <span className="text-green-600 text-xs font-black bg-white px-2 py-1 rounded-lg border border-green-100 shadow-sm">
                                        {job.salary > 0 ? `฿${job.salary.toLocaleString()}` : 'รายได้ดี'}
                                    </span>
                                </div>
                            </Link>
                        ))
                     ) : (
                        <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center border border-dashed">
                            ยังไม่มีตำแหน่งงานที่อนุมัติจ้าแม่
                        </div>
                     )}

                     {/* 🚩 ปุ่มล่างสุด ปรับให้เป็น Link ไปหน้าโปรไฟล์บริษัทแทน */}
                     <Link 
                         href={`/student/establishments/${est.id}`}
                         className="mt-4 block w-full text-center py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold text-sm shadow-md active:scale-95"
                     >
                         ดูโปรไฟล์บริษัทนี้
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
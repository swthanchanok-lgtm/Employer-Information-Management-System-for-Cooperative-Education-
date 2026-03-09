'use client'; 

import Link from 'next/link';

// --- ส่วนกำหนด Type (Interface) ---
interface Job {
  id: string | number;
  title: string;
  allowance: number;
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
}

export default function EstablishmentList({ establishments }: EstablishmentListProps) {
  
  // ✅ สร้างตัวแปรที่ปลอดภัย (ถ้าส่งมาเป็น null ให้ถือว่าเป็นอาเรย์ว่าง [])
  const safeEstablishments = establishments || [];

  return (
    <div className="w-full">
      
     

      {/* --- ส่วนแสดงรายชื่อบริษัท --- */}
      {safeEstablishments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
          ไม่พบข้อมูลสถานประกอบการ
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeEstablishments.map((est) => (
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
                     <p className="text-xs font-semibold text-gray-400 uppercase">ตำแหน่งที่เปิดรับ:</p>
                     
                     {est.jobs && est.jobs.length > 0 ? (
                        est.jobs.map(job => (
                            <div key={job.id} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded border border-slate-100">
                                <span className="font-medium text-blue-700 truncate w-2/3">{job.title}</span>
                                <span className="text-green-600 text-xs font-bold whitespace-nowrap">
                                    {job.allowance > 0 ? `฿${job.allowance}` : '-'}
                                </span>
                            </div>
                        ))
                     ) : (
                        <div className="text-sm text-gray-400 italic bg-gray-50 p-2 rounded text-center">
                            ยังไม่มีตำแหน่งงาน
                        </div>
                     )}
                  </div>
                  
                  {/* ปุ่มดูรายละเอียด */}
                  <Link 
                    href={`/establishment/${est.id}`}
                    className="mt-4 block w-full text-center py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium text-sm"
                  >
                    ดูรายละเอียด
                  </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
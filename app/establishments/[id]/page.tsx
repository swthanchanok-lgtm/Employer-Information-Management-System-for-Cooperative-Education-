'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2, MapPin, Phone, Globe,
  ArrowLeft, Briefcase, Info, ArrowRight, PlusCircle, Star
} from 'lucide-react';

export default function EstablishmentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  // 🚩 State สำหรับจัดการ Modal รีวิว
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💡 สมมติเช็คสิทธิ์ (ในอนาคตดึงจาก Session จริงนะจ๊ะ)
  const isTeacher = true;
  const isIntern = true;

  useEffect(() => {
    fetch(`/api/establishments/${id}`)
      .then(res => res.json())
      .then(json => setData(json));
  }, [id]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center font-black text-slate-300 animate-pulse tracking-widest uppercase text-xs">
        กำลังโหลดโปรไฟล์บริษัทให้คุณธัญชนกนะจ๊ะ... ✨
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-left relative">

      {/* Header Image */}
      <div className="h-32 bg-[#2B4560] relative">
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/20 transition-all z-20"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* เนื้อหาหลัก */}
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
              <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm">
                <MapPin size={18} className="text-rose-400" /> {data.address}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* ฝั่งซ้าย: รายละเอียดบริษัท & รีวิว */}
            <div className="md:col-span-2 p-8 md:p-12 border-r border-slate-50">
              <h3 className="text-xl font-black text-[#2B4560] mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl"><Info size={20} className="text-blue-500" /></div>
                เกี่ยวกับบริษัท
              </h3>
              <p className="text-slate-500 leading-relaxed font-bold bg-slate-50/50 p-8 rounded-[2rem] mb-10 whitespace-pre-line text-sm">
                {data.description || "ยินดีต้อนรับจ้า"}
              </p>

              {/* รายการงาน */}
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-xl font-black text-[#2B4560] flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl"><Briefcase size={20} className="text-emerald-500" /></div>
                  ตำแหน่งงานที่เปิดรับ
                </h3>
              </div>

              <div className="grid gap-4 mb-12">
                {data.jobs?.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/student/jobs/${job.id}`)}
                    className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                        <Briefcase size={22} />
                      </div>
                      <div>
                        <p className="font-black text-[#2B4560] text-lg">{job.title}</p>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">
                          💰 {job.salary > 0 ? `฿${job.salary.toLocaleString()} / เดือน` : 'ตามตกลง'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 text-slate-300 p-3 rounded-xl group-hover:bg-[#2B4560] group-hover:text-white group-hover:scale-110 transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 🌟 ส่วนรีวิว */}
              <section className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-[#2B4560] flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 rounded-xl"><Star size={20} className="text-yellow-500 fill-yellow-500" /></div>
                    รีวิวจากรุ่นพี่และอาจารย์
                  </h3>

                  {(isTeacher || isIntern) && (
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-6 py-3 bg-yellow-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-200"
                    >
                      เขียนรีวิวให้ดาว
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {data.reviews?.length > 0 ? (
                    data.reviews.map((review: any) => (
                      <div key={review.id} className="bg-slate-50 p-6 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-[#2B4560] shadow-sm border border-slate-100 uppercase">
                              {review.user?.name ? review.user.name[0] : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-[#2B4560]">{review.user?.name || "ไม่ประสงค์ออกนาม"}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{review.user?.role || "นักศึกษา"}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5 items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed italic px-2">
                          "{review.comment || "ไม่มีความเห็นเพิ่มเติมจ้า"}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                      <p className="text-slate-300 font-bold italic text-sm">ยังไม่มีรีวิวสำหรับบริษัทนี้จ้าแม่</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ฝั่งขวา: ติดต่อ & เพิ่มงาน */}
            <div className="p-8 md:p-12 bg-slate-50/30 space-y-8">
              <section>
                <h3 className="text-sm font-black text-[#2B4560] mb-6 uppercase tracking-widest italic">ข้อมูลติดต่อ</h3>
                <div className="space-y-6">
                  <ContactItem icon={<Phone size={18} />} label="เบอร์โทรศัพท์" value={data.contact || "ไม่ได้ระบุ"} />
                  <ContactItem icon={<Globe size={18} />} label="แผนที่ / เว็บไซต์" value={data.mapUrl ? "คลิกเพื่อดูแผนที่" : "ไม่ได้ระบุ"} link={data.mapUrl} />
                </div>
              </section>

              <div className="pt-6 border-t border-slate-100">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">เพิ่มข้อมูลตำแหน่งงาน</p>
                  <button
                    onClick={() => router.push(`/student/establishments/${id}/add-job`)}
                    className="w-full py-5 bg-[#2B4560] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-lg shadow-blue-900/10 active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <PlusCircle size={16} className="group-hover:rotate-90 transition-transform" /> เพิ่มตำแหน่งงานใหม่
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 🚩 Popup รีวิว (Review Modal) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2B4560]/60 backdrop-blur-md transition-opacity"
            onClick={() => !isSubmitting && setIsReviewModalOpen(false)}
          ></div>

          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <div className="p-10 text-center">
              <h3 className="text-2xl font-black text-[#2B4560] mb-2">เขียนรีวิวบริษัท</h3>
              <p className="text-slate-400 text-sm font-bold mb-8 italic">ประสบการณ์ของคุณเป็นอย่างไรบ้างจ๊ะแม่?</p>

              {/* ระบบดาว Interactive */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90 hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`transition-colors ${star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-200"
                        }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="บอกเล่าความในใจให้รุ่นน้องฟังหน่อย..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 rounded-[2rem] p-6 text-sm font-bold text-slate-600 border-2 border-transparent focus:border-yellow-200 focus:bg-white outline-none transition-all min-h-[150px] resize-none mb-8"
              ></textarea>

              <div className="flex gap-4">
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  disabled={isSubmitting || rating === 0}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      // 🚩 เช็คให้ชัวร์ว่า Path นี้ตรงกับไฟล์ api/establishments/[id]/reviews/route.ts
                      const res = await fetch(`/api/establishments/${id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ rating, comment })
                      });

                      if (res.ok) {
                        alert("🎉 รีวิวสำเร็จแล้วจ้าแม่!");
                        setIsReviewModalOpen(false);
                        // 💡 แทนที่จะ reload ทั้งหน้า ใช้ fetch ข้อมูลใหม่จะลื่นกว่าจ้า
                        const updatedRes = await fetch(`/api/establishments/${id}`);
                        const updatedData = await updatedRes.json();
                        setData(updatedData);

                        setRating(0);
                        setComment('');
                      } else {
                        const errorData = await res.json();
                        alert(`อุ๊ย! มีปัญหา: ${errorData.error}`);
                      }
                    } catch (err) {
                      console.error("Fetch Error:", err);
                      alert("เชื่อมต่อหลังบ้านไม่ได้จ้าแม่ ลองเช็ค API นะ");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  // 🎨 ใส่ ClassName ให้สวยงาม ปุ่มจะได้ไม่หายจ้า
                  className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg 
    ${(isSubmitting || rating === 0)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-yellow-400 text-white hover:bg-yellow-500 hover:-translate-y-1 shadow-yellow-200'}`}
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'ส่งรีวิวเลย ✨'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ContactItem = ({ icon, label, value, link }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">{value}</a>
      ) : (
        <p className="text-sm font-bold text-[#2B4560]">{value}</p>
      )}
    </div>
  </div>
);
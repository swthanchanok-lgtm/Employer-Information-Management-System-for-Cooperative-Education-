'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Camera, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // 🚩 อย่าลืมลง npm install qrcode.react
import { SignatureBlock } from '@/components/SignatureBlock';

export default function EvaluationForm({ student, form }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sigRefTeacher = useRef<any>(null);
  const sigRefMentor = useRef<any>(null);

  // 🚩 รวม State ทุกอย่างไว้ที่เดียว
  const [formData, setFormData] = useState({
    score: '',
    comment: '',
    visitDate: new Date().toISOString().split('T')[0],
    imageFile: null as File | null
  });

  // 🚩 สร้างลิงก์ QR สำหรับพี่เลี้ยง (ฟอร์ม 3)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mentorLink = `${baseUrl}/evaluation/3?studentId=${student?.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('ยืนยันการบันทึกข้อมูลการนิเทศ?')) return;
    setLoading(true);

    // ดึงลายเซ็นเป็น Base64
    const teacherSig = sigRefTeacher.current?.getCanvas().toDataURL('image/png');
    const mentorSig = sigRefMentor.current?.getCanvas().toDataURL('image/png');

    try {
      // 🚩 ในการส่งรูปภาพและข้อมูลเยอะๆ แนะนำให้ใช้ FormData นะจ๊ะ
      const res = await fetch('/api/supervisor/save-evaluation', {
        method: 'POST',
        body: JSON.stringify({
          studentId: student.id,
          ...formData,
          teacherSignature: teacherSig,
          mentorSignature: mentorSig,
          // ถ้ามีระบบอัปโหลดรูป แม่ต้องส่งภาพแยกไปที่ Cloud หรือแปลง Base64 จ้า
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        alert("บันทึกข้อมูลและลายเซ็นเรียบร้อยแล้วค่ะแม่!");
        router.push('/supervisor/dashboard');
        router.refresh();
      }
    } catch (error) {
      alert("อุ๊ย! บันทึกไม่สำเร็จจ้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-4">
      
      {/* 1. ส่วนข้อมูลพื้นฐาน (ดึงจาก Props student) */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-[#2B4560] mb-4">ข้อมูลการนิเทศ: {student?.name}</h2>
        <p className="text-slate-500 font-bold">📍 {student?.establishment?.name || 'ไม่ระบุสถานประกอบการ'}</p>
      </div>

      {/* 2. ส่วนคิวอาร์โค้ด (ให้พี่เลี้ยงสแกน) */}
      <div className="bg-amber-50 p-6 rounded-[2.5rem] border-2 border-dashed border-amber-200 text-center space-y-4">
        <div className="flex justify-center mb-2"><QrCode className="text-amber-500" size={40} /></div>
        <h3 className="text-lg font-black text-amber-700">QR Code สำหรับพี่เลี้ยง (แบบประเมินที่ 3)</h3>
        <div className="bg-white p-4 inline-block rounded-2xl shadow-sm border border-amber-100">
          <QRCodeSVG value={mentorLink} size={150} />
        </div>
        <p className="text-[10px] text-amber-500 font-bold break-all">{mentorLink}</p>
      </div>

      {/* 3. ส่วนกรอกคะแนนและวันที่ (ที่แม่เพิ่มมา) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">วันที่เข้าตรวจนิเทศ</label>
          <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" 
            value={formData.visitDate} onChange={(e) => setFormData({...formData, visitDate: e.target.value})} required />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">คะแนน (0-100)</label>
          <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" 
            value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">บันทึกเพิ่มเติม</label>
          <textarea rows={3} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} />
        </div>
      </div>

      {/* 4. อัปโหลดรูปถ่าย */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <label className="block text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
          <Camera size={16} /> รูปถ่ายขณะนิเทศงาน
        </label>
        <input type="file" accept="image/*" capture="environment" 
          onChange={(e) => setFormData({...formData, imageFile: e.target.files?.[0] || null})}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 font-bold" />
      </div>

      {/* 5. ลายเซ็นดิจิทัล */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100">
          <p className="font-black text-center mb-4 text-[#2B4560]">ลายเซ็นอาจารย์</p>
          <SignatureBlock ref={sigRefTeacher} position="อาจารย์นิเทศ" />
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100">
          <p className="font-black text-center mb-4 text-[#2B4560]">ลายเซ็นพี่เลี้ยง</p>
          <SignatureBlock ref={sigRefMentor} position="พี่เลี้ยง/ผู้ประเมิน" />
        </div>
      </div>

      {/* 6. ปุ่มส่งงาน */}
      <button type="submit" disabled={loading}
        className="w-full bg-[#2B4560] text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-900 transition-all active:scale-95 disabled:opacity-50 shadow-xl">
        <Save size={24} /> {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกผลการนิเทศและลายเซ็น"}
      </button>

    </form>
  );
}
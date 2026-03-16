'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Briefcase, Building2 } from 'lucide-react'; 

export default function AddEstablishmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    contact: '',
    category: '',
    mapUrl: '', 
    imageUrl: '',
    jobTitle: '',
    salary: '',
    hasShuttle: false,
    hasDorm: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/establishments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await Swal.fire({ 
          icon: 'success', 
          title: 'บันทึกสำเร็จ', 
          text: 'ข้อมูลสถานประกอบการถูกเพิ่มเข้าสู่ระบบแล้ว',
          timer: 1500, 
          showConfirmButton: false 
        });
        
        // 🚩 แก้ไขจุดที่ 1: บันทึกเสร็จแล้วกลับหน้า Dashboard นักศึกษา
        router.push('/student/dashboard');
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">🏢 เพิ่มสถานประกอบการใหม่</h1>
            {/* 🚩 แก้ไขจุดที่ 2: ปุ่มยกเลิก กลับหน้า Dashboard นักศึกษา */}
            <Link href="/student/dashboard" className="text-gray-500 hover:text-gray-700 text-sm font-medium">❌ ยกเลิก</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสถานประกอบการ *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
             <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เกี่ยวกับสถานประกอบการ *</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ช่องทางติดต่อ *</label>
              <input type="text" name="contact" required value={formData.contact} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ Google Maps (ถ้ามี)</label>
            <input type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="http://maps.google..." />
          </div>

          <div className="border p-4 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">รูปภาพสถานประกอบการ</label>
            <div className="flex gap-4 mb-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={uploadMode === 'url'} onChange={() => setUploadMode('url')} /> 🔗 URL รูป
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={uploadMode === 'file'} onChange={() => setUploadMode('file')} /> 📁 อัปโหลดไฟล์
                </label>
            </div>
            {uploadMode === 'url' ? (
                <input type="url" className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="https://..." onChange={handleUrlInputChange} value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl} />
            ) : (
                <input type="file" accept="image/*" className="w-full text-sm" onChange={handleFileChange} />
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-[#2B4560] mb-4 flex items-center gap-2">
              <Briefcase size={20} /> ตำแหน่งงานและสวัสดิการ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อตำแหน่งงาน *</label>
                <input type="text" name="jobTitle" required placeholder="เช่น Full-stack Developer" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ค่าตอบแทน (บาท/เดือน)</label>
                <input type="number" name="salary" placeholder="15000" value={formData.salary} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm font-bold text-blue-800">สวัสดิการที่มีให้</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasShuttle" checked={formData.hasShuttle} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">🚌 รถรับส่ง</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasDorm" checked={formData.hasDorm} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">🏠 หอพัก</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition-all ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isLoading ? '⏳ กำลังบันทึก...' : '💾 บันทึกข้อมูล'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
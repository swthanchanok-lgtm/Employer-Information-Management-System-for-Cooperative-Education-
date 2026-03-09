'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Globe, Phone, Mail, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminAddEstablishment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    phone: '',
    email: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/establishments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'APPROVED' }),
      });
      if (response.ok) {
        alert('เพิ่มสถานประกอบการเรียบร้อยแล้ว');
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 text-left">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-slate-400 mb-6">
          <ArrowLeft size={18} /> <span>Back to Dashboard</span>
        </Link>
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="bg-[#2B4560] p-8 text-white">
            <h1 className="text-2xl font-black">เพิ่มสถานประกอบการใหม่</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">ชื่อสถานประกอบการ *</label>
              <input required className="w-full p-4 bg-slate-50 border rounded-2xl" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">ที่อยู่ *</label>
              <textarea required className="w-full p-4 bg-slate-50 border rounded-2xl" 
                onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-[#2B4560] text-white rounded-2xl font-bold">
              {loading ? 'กำลังบันทึก...' : 'ยืนยันการเพิ่มข้อมูล'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import EstablishmentList from './EstablishmentList';

export default function SearchEstablishmentPage() {
  const [establishments, setEstablishments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 🚩 1. เรียกใช้งาน useSession ตรงนี้เลย เพื่อดึง session ของคนที่ล็อกอิน
  const { data: session } = useSession()

  const fetchEstablishments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/establishments') 
      const data = await res.json()
      setEstablishments(data)
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEstablishments()
  }, [])

  // 🚩 2. เปลี่ยนมาดึงชื่อจาก session.user.name แทนจ้า
  const displayTitle = session?.user?.name || 'นักศึกษา'

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2B4560] flex items-center gap-3">
          สวัสดีคุณ {displayTitle} 👋
        </h1>
        <p className="text-slate-400 font-bold mt-2">ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษาของคุณ</p>
      </div>

      <button className="flex items-center gap-2 text-slate-400 hover:text-[#2B4560] transition-all mb-6 font-bold text-sm">
        ← กลับหน้าหลัก
      </button>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2B4560] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อบริษัทหรือตำแหน่งงาน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-[#2B4560]/5 transition-all font-medium"
          />
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-100 pl-12 pr-10 py-4 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-[#2B4560]/5 transition-all font-bold text-slate-600 cursor-pointer">
            <option>แสดงทุกสาขาวิชา</option>
          </select>
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400 italic">กำลังโหลดข้อมูล...</div>
      ) : (
        <EstablishmentList establishments={establishments} searchQuery={searchQuery} />
      )}
    </div>
  )
}
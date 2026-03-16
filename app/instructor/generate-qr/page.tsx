'use client'

import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { Suspense } from 'react'

function QRContent() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')

  // 🚩 สร้าง URL ลิงก์ที่จะให้พี่เลี้ยงแสกน (ปรับโดเมนตามจริงตอน Deploy นะจ๊ะ)
  // สมมติว่าหน้าประเมินของพี่เลี้ยงอยู่ที่ /evaluation/employer?studentId=...
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const evaluationLink = `${baseUrl}/evaluation/employer?studentId=${studentId}`

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center space-y-8">
        
        <div className="space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#2B4560]">บันทึกข้อมูลสำเร็จ!</h1>
          <p className="text-slate-500 font-bold">ขั้นตอนสุดท้าย: ให้พี่เลี้ยงสแกน QR Code นี้เพื่อทำแบบประเมินความพึงพอใจ</p>
        </div>

        {/* --- ส่วนแสดง QR Code --- */}
        <div className="bg-slate-50 p-6 rounded-[2rem] inline-block border-4 border-dashed border-slate-200">
          {studentId ? (
            <QRCodeSVG 
              value={evaluationLink} 
              size={250}
              level="H"
              includeMargin={true}
            />
          ) : (
            <p className="text-red-500">ไม่พบรหัสนักศึกษา</p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-medium">
            URL สำหรับสแกน: <br/>
            <span className="text-blue-500 break-all">{evaluationLink}</span>
          </p>
          
          <button 
            onClick={() => window.print()}
            className="w-full bg-[#2B4560] text-white font-black py-4 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            🖨️ พิมพ์หน้านี้
          </button>
          
          <button 
            onClick={() => window.location.href = '/instructor/dashboard'}
            className="w-full bg-slate-100 text-slate-500 font-black py-4 rounded-full hover:bg-slate-200 transition-all"
          >
            กลับหน้าแดชบอร์ด
          </button>
        </div>

      </div>
    </div>
  )
}

// ต้องครอบด้วย Suspense เพราะใช้ useSearchParams จ้า
export default function GenerateQRPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">กำลังโหลด...</div>}>
      <QRContent />
    </Suspense>
  )
}
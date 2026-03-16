"use client";
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// 🚩 ใช้ forwardRef เพื่อให้ไฟล์ EvaluationForm สามารถสั่ง "ล้างลายเซ็น" หรือ "ดึงข้อมูลรูป" ได้
export const SignatureBlock = forwardRef((props: any, ref) => {
  const { name = "", position = "", showPosition = true } = props;
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [currentDate] = useState(new Date());

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  // 🚩 ส่งฟังก์ชัน getCanvas ไปให้ไฟล์แม่ (EvaluationForm) เรียกใช้
  useImperativeHandle(ref, () => ({
    getCanvas: () => sigCanvas.current,
    clear: () => sigCanvas.current?.clear(),
  }));

return (
  <div className="flex flex-col items-center space-y-2 py-4 text-[#2B4560]">
    {/* 1. ช่องลายเซ็น Digital */}
    <div className="w-full max-w-[300px] h-32 bg-slate-50 border-b-2 border-dashed border-slate-300 relative rounded-t-lg overflow-hidden">
      <SignatureCanvas 
        ref={sigCanvas}
        canvasProps={{ className: "w-full h-full cursor-crosshair" }} 
      />
      <button type="button" onClick={() => sigCanvas.current?.clear()} className="absolute top-1 right-2 text-[10px] text-rose-400 font-bold">ล้างลายเซ็น</button>
    </div>

    {/* 2. ส่วนข้อมูลกำกับ */}
    <div className="text-sm space-y-3 mt-4 w-full max-w-xs px-4">
      <div className="flex items-end">
        <span className="whitespace-nowrap">(ลงชื่อ)</span>
        <div className="flex-1 border-b border-dotted border-slate-400 text-center pb-1 px-2 min-h-[24px]">{name}</div>
      </div>
      
      {showPosition && (
        <div className="flex items-end">
          <span className="whitespace-nowrap">(ตำแหน่ง)</span>
          <div className="flex-1 border-b border-dotted border-slate-400 text-center pb-1 px-2 min-h-[24px]">{position}</div>
        </div>
      )}

      {/* วันที่อยู่ท้ายสุดของแต่ละบล็อก */}
      <div className="flex items-end text-[12px] gap-1 justify-center">
        <span>วันที่</span> <span className="border-b border-dotted border-slate-400 px-1 min-w-[25px] text-center">{currentDate.getDate()}</span>
        <span>เดือน</span> <span className="border-b border-dotted border-slate-400 px-1 min-w-[70px] text-center">{thaiMonths[currentDate.getMonth()]}</span>
        <span>พ.ศ.</span> <span className="border-b border-dotted border-slate-400 px-1 min-w-[45px] text-center">{currentDate.getFullYear() + 543}</span>
      </div>
    </div>
  </div>
);
});

SignatureBlock.displayName = "SignatureBlock";
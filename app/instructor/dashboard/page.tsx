import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // หรือตามที่แม่ใช้ดึง session
import { authOptions } from "@/lib/auth"; 
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default async function InstructorDashboard() {
  // 1. ดึงข้อมูลคนล็อคอิน
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const userRole = session?.user?.role; // เก็บไว้เช็คว่าเป็นอาจารย์ประจำวิชาไหม

  // 2. ดึงรายชื่อเด็ก (เฉพาะที่มีชื่อเราในกลุ่ม)
  const myStudents = await prisma.user.findMany({
    where: {
      role: { name: "STUDENT" },
      supervisionGroup: {
        instructors: {
          some: { id: userId } 
        }
      }
    },
    include: {
      supervisionGroup: {
        include: { instructors: true }
      },
      evaluations: {
        orderBy: { evaluatedAt: 'desc' }
      }
    },
    orderBy: { username: 'asc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* ส่วนหัว */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#2B4560]">ระบบนิเทศสหกิจศึกษา</h1>
        <p className="text-slate-400 font-bold">สวัสดีค่ะอาจารย์ {session?.user?.name}</p>
      </div>

      {/* --- ส่วนที่ 1: สำหรับอาจารย์ประจำวิชาเท่านั้น --- */}
      {userRole === "COURSE_INSTRUCTOR" && (
        <div className="mb-12 p-8 bg-blue-50 rounded-[2.5rem] border-2 border-dashed border-blue-200">
          <h2 className="text-xl font-black text-blue-700 mb-4 flex items-center gap-2">
            <ShieldCheck size={24} /> เมนูจัดการ (อาจารย์ประจำวิชา)
          </h2>
          <div className="flex gap-4">
             <button 
               className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all"
               onClick={() => {/* ลิงก์ไปหน้า matching */}}
             >
               จัดกลุ่มอาจารย์นิเทศ
             </button>
             {/* เพิ่มปุ่มรายงาน หรือ ดูภาพรวม ได้ตรงนี้จ้า */}
          </div>
        </div>
      )}

      {/* --- ส่วนที่ 2: งานนิเทศที่ได้รับมอบหมาย (ทุกคนเห็น) --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[#2B4560] flex items-center gap-2">
          <GraduationCap size={28} /> รายชื่อนักศึกษาที่ต้องเข้านิเทศ
        </h2>
        
        {myStudents.length > 0 ? (
          <div className="grid gap-4">
            {myStudents.map((student: any) => (
              <div key={student.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
                {/* ข้อมูลเด็ก */}
                <div>
                  <p className="font-black text-lg text-[#2B4560]">{student.name} {student.surname}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {student.username}</p>
                </div>

                {/* ปุ่มการกระทำ */}
                <div className="text-right">
                  {student.evaluations.length > 0 ? (
                    <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-xs font-black border border-emerald-100">
                      ✅ ประเมินแล้วโดย {student.evaluations[0].evaluatorName}
                    </span>
                  ) : (
                    <button className="bg-[#2B4560] text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-[#1a2b3d] transition-all shadow-md">
                      เริ่มแบบประเมิน
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[2.5rem]">
            <p className="text-slate-400 font-bold">ยังไม่มีรายชื่อนักศึกษาที่ได้รับมอบหมายจ้า</p>
          </div>
        )}
      </div>
    </div>
  );
}
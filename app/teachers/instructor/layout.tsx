import InstructorSidebar from '@/app/components/instructor/InstructorSidebar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 🚩 เรียกใช้ Sidebar ที่เราสร้างไว้ข้างซ้าย */}
      <InstructorSidebar />

      {/* ส่วนเนื้อหาขวามือ */}
      <main className="flex-1 ml-72 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
// 🚩 app/student/layout.tsx

// เดินเข้าไปหา Sidebar ในห้อง dashboard/components จ้า
import StudentSidebar from "./dashboard/components/StudentSidebar"; 

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 🧭 Sidebar นักศึกษา จะคงอยู่ตลอดไปไม่ว่านักศึกษาจะเปลี่ยนไปหน้าไหน */}
      <StudentSidebar />
      
      {/* 📄 เนื้อหาของแต่ละหน้าจะมาโผล่ตรงนี้จ้า */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
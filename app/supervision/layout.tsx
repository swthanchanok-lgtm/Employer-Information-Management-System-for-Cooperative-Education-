import SupervisorSidebar from "./dashboard/components/Sidebar";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar อยู่ฝั่งซ้าย (ซึ่งปกติจะกว้างประมาณ 72 หน่วย หรือ 18rem) */}
      <SupervisorSidebar />
      
      {/* 🚩 เพิ่ม ml-72 เพื่อให้เนื้อหาไม่โดน Sidebar ทับจ้า */}
      <main className="flex-1 ml-72 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
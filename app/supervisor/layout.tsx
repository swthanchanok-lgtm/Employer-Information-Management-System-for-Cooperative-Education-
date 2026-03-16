import Sidebar from "../supervision/dashboard/components/Sidebar";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar /> {/* ✅ ตรงกันแล้ว หายแดงแน่นอนจ้า */}
      <main className="flex-1 ml-72"> 
        {children}
      </main>
    </div>
  );
}
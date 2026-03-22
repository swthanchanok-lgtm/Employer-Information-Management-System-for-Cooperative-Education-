// ไฟล์: app/admin/users/UserListClient.tsx
'use client';
import React, { useState } from 'react';
import { Search, Users, Shield, GraduationCap, Briefcase, BookOpen, ChevronRight, User } from 'lucide-react';

// 🚩 Type สำหรับจัดกลุ่มข้อมูล
type DepartmentGroup = Record<string, any[]>;
type RoleGroup = Record<string, DepartmentGroup>;

export default function UserListClient({ initialUsers }: { initialUsers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันกรองข้อมูล
  const filteredUsers = initialUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // จัดกลุ่มข้อมูล
  const groupedUsers: RoleGroup = filteredUsers.reduce((acc: RoleGroup, user) => {
    const role = user.role || 'ไม่ระบุ Role';
    const dept = user.department || 'ไม่ระบุสาขาวิชา';

    if (!acc[role]) acc[role] = {};
    if (!acc[role][dept]) acc[role][dept] = [];
    
    acc[role][dept].push(user);
    return acc;
  }, {});

  // ไอคอนและสีสำหรับแต่ละ Role (อัปเกรดสีให้ดูละมุนขึ้น)
  const getRoleStyle = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN': 
        return { icon: <Shield size={22} />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'STUDENT': 
        return { icon: <GraduationCap size={22} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'SUPERVISOR': 
        return { icon: <BookOpen size={22} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'INSTRUCTOR': 
        return { icon: <Users size={22} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'EMPLOYER': 
        return { icon: <Briefcase size={22} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' };
      default: 
        return { icon: <User size={22} />, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      
      {/* --- ส่วน Header & Search (ดีไซน์โค้งมน ดูลอยๆ มีมิติ) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white">
        <div>
          <h2 className="text-3xl font-black text-[#2B4560] flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Users size={24} />
            </div>
            ทำเนียบสมาชิก
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-2 ml-16">
            จัดการและดูรายชื่อสมาชิกทั้งหมด แบ่งตามบทบาทและสังกัด
          </p>
        </div>
        
        <div className="relative w-full md:w-[400px]">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="พิมพ์ชื่อ, นามสกุล หรือรหัสค้นหา..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200/60 rounded-full shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-medium transition-all text-sm text-[#2B4560] placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- ส่วน Render ข้อมูลที่จัดกลุ่มแล้ว --- */}
      {Object.keys(groupedUsers).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-400">ไม่พบรายชื่อที่ค้นหา</h3>
          <p className="text-slate-400 text-sm mt-2">ลองเปลี่ยนคำค้นหาใหม่อีกครั้งนะจ๊ะ</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedUsers).map(([role, depts]) => {
            const departments = depts as DepartmentGroup; 
            const roleStyle = getRoleStyle(role);

            return (
              <div key={role} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
                
                {/* แถบสีตกแต่งด้านซ้าย */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${roleStyle.bg}`}></div>

                {/* แถบหัวข้อ Role */}
                <div className="p-6 px-8 flex items-center gap-4 border-b border-slate-50">
                  <div className={`p-3 rounded-2xl ${roleStyle.bg} ${roleStyle.color}`}>
                    {roleStyle.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#2B4560] uppercase tracking-wider">
                      {role}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-[0.1em]">
                      Role Group
                    </p>
                  </div>
                  <div className="ml-auto bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-100">
                    รวม <span className={roleStyle.color}>{Object.values(departments).flat().length}</span> คน
                  </div>
                </div>

                {/* ส่วนของสาขาวิชาใน Role นั้นๆ */}
                <div className="p-8 pt-6 space-y-10">
                  {Object.entries(departments).map(([dept, usersInDept]) => {
                    const usersList = usersInDept as any[]; 
                    
                    return (
                      <div key={dept} className="space-y-4 pl-2">
                        {/* ชื่อสาขาวิชา */}
                        <div className="flex items-center gap-3">
                          <h4 className="flex items-center gap-2 text-base font-bold text-slate-700">
                            <ChevronRight size={18} className="text-slate-300" /> 
                            {dept} 
                          </h4>
                          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">
                            {usersList.length}
                          </span>
                        </div>
                        
                        {/* ตารางรายชื่อคนในการ์ด (ออกแบบใหม่ให้คลีนๆ เด้งๆ) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-8">
                          {usersList.map((user: any) => (
                            <div 
                              key={user.id} 
                              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                              <div className={`w-12 h-12 rounded-full ${roleStyle.bg} ${roleStyle.color} flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-300`}>
                                {user.name?.charAt(0) || '?'}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-sm text-[#2B4560] truncate group-hover:text-blue-600 transition-colors">
                                  {user.name} {user.surname}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                  {user.username || user.email || 'ไม่มีข้อมูลติดต่อ'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '../../lib/session'
import { prisma } from '@/lib/prisma'

export type LoginState = {
  error?: string
} | null

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // 1. ตรวจสอบเบื้องต้น
  if (!username || !password) {
    return { error: 'กรุณากรอก Username และ Password จ้าแม่' }
  }

  let ldapData: { status: string; message: string; id: string; email: string; name: string }

  // 2. ด่านที่ 1: ตรวจสอบกับมหาลัย (KSU LDAP)
  try {
    const res = await fetch(process.env.LDAP_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LDAP_API_KEY!,
      },
      // หมายเหตุ: บาง API ของมหาลัยอาจใช้ 'username' หรือ 'email' แม่เช็คกับอาจารย์อีกทีนะจ๊ะ
      body: JSON.stringify({ email: username, password }), 
    })

    ldapData = await res.json()

    if (!res.ok || ldapData.status !== 'success') {
      return { error: ldapData.message || 'รหัสผ่านมหาลัยไม่ถูกต้องนะจ๊ะแม่' }
    }
  } catch (err) {
    return { error: 'ไม่สามารถเชื่อมต่อ LDAP ได้ (เช็ค .env.local หรือยังจ๊ะ?)' }
  }

  // 3. ด่านที่ 2: ตรวจสอบ Role ในระบบของเรา (Database)
  // เราจะดึงข้อมูล User พร้อมกับ "ชื่อ Role" มาด้วยเลยจ้า
  const userInDb = await prisma.user.findUnique({
    where: { 
      username: username // หรือใช้ email: ldapData.email ตามที่แม่เก็บใน DB จ้า
    },
    include: {
      role: true // 🚩 สำคัญมาก! บรรทัดนี้จะทำให้แม่เข้าถึง userInDb.role.name ได้จ้า
    }
  })

  if (!userInDb) {
    return { error: 'ผ่านด่านมหาลัยแล้ว แต่ไม่มีชื่อในระบบฝึกงานของเรานะจ๊ะ' }
  }

  // 4. สร้าง Session เก็บข้อมูลผู้ใช้และ Role
  // ตรวจสอบชื่อฟิลด์ในตาราง Role ของแม่นะจ๊ะว่าเป็น .name หรือ .title
  const currentRole = userInDb.role?.name || 'STUDENT'; 

  await createSession({
    id: userInDb.id.toString(),
    name: ldapData.name,
    role: currentRole,
  })

  // 5. แยกย้ายไปตามหน้า Dashboard (Redirect)
  if (currentRole === 'ADMIN') {
    redirect('/admin/dashboard')
  } else if (currentRole === 'INSTRUCTOR' || currentRole === 'COURSE_INSTRUCTOR') {
    redirect('/teachers/instructor/dashboard')
  } else if (currentRole === 'SUPERVISOR') {
    redirect('/supervisor/dashboard')
  } else {
    redirect('/student/dashboard')
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
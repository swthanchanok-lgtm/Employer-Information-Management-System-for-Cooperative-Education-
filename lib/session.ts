import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// 🚩 1. เพิ่ม role เข้าไปในโครงสร้าง User จ้า
export type SessionUser = {
  id: string
  name: string
  role: string // 👈 เติมตรงนี้เพื่อให้ TypeScript เลิกบ่น!
  email?: string // ใส่เครื่องหมาย ? ไว้เผื่อบางคนไม่มี email จะได้ไม่พังจ้า
}

export async function encrypt(payload: SessionUser) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    // 🚩 คืนค่ากลับมาเป็น SessionUser ที่มี role ด้วยจ้า
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 ชั่วโมงตามที่อาจารย์ตั้งไว้จ้า
  const session = await encrypt(user)
  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  if (!cookie) return null
  return await decrypt(cookie)
}
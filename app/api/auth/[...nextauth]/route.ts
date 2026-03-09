import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // 🔍 ใส่ Log เพื่อดูว่าที่หน้าเว็บพิมพ์มา มันเข้ามาถึงที่นี่จริงไหม
        console.log("-----------------------------------------");
        console.log("🔐 พยายามล็อกอินด้วย Username:", credentials.username);

        const user = await prisma.user.findUnique({
          where: { 
            // 🚩 ตรวจสอบว่าใน schema.prisma ใช้ชื่อฟิลด์นี้จริงหรือไม่
            username: credentials.username 
          }
        });

        if (!user) {
          console.log("❌ ไม่พบชื่อผู้ใช้นี้ในฐานข้อมูล");
          
          // ตัวช่วย Debug: ลองหาว่ามี User อื่นๆ ในระบบบ้างไหม (ลบออกได้ภายหลัง)
          const checkAnyUser = await prisma.user.findMany({ take: 1 });
          if (checkAnyUser.length > 0) {
            console.log("💡 คำแนะนำ: ในระบบมี User อยู่ แต่ชื่อไม่ตรงกับที่พิมพ์มา");
          } else {
            console.log("💡 คำแนะนำ: ฐานข้อมูลว่างเปล่า ยังไม่มี User เลยสักคน");
          }
          
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log("❌ รหัสผ่านไม่ถูกต้องสำหรับ:", credentials.username);
          return null;
        }

        console.log("✅ ล็อกอินสำเร็จ: ", user.name, "| Role:", user.role);

        // ✅ ส่งข้อมูลกลับไป (รวม Role ด้วย)
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // ✅ เก็บ Role ไว้ใน Token
      if (user) {
        token.name = user.name;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }: any) {
      // ✅ ส่ง Role จาก Token ไปที่หน้าบ้าน (Session)
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role; 
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "long-secret-key-123",
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
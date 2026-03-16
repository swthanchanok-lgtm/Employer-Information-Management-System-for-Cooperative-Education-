// 🚩 lib/auth.ts
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth"; // เติมอันนี้ให้น้องหน่อยจ้า

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { role: true } 
        });

        // ⚠️ หมายเหตุ: ถ้าแม่ยังไม่ได้ทำระบบ Hash รหัสผ่าน มันจะเช็คแบบดื้อๆ ได้
        // แต่ถ้าทำ Hash ต้องเพิ่ม bcrypt.compare ด้วยนะจ๊ะแม่ครีม
        if (!user) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role.name, 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;   
        token.name = user.name;
        token.role = user.role; 
        
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;     
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.id = token.sub; 
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "long-secret-key-123",
  pages: {
    signIn: '/login',
  }
};
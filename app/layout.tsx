import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 🚩 นำเข้า Providers ที่เราสร้างไว้ (เช็ค Path ให้ตรงกับที่คุณเซฟไฟล์ไว้นะครับ)
import { Providers } from "./components/Providers"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CO-EMS | Student Internship System",
  description: "ระบบจัดการสหกิจศึกษา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 🚩 ครอบด้วย Providers เพื่อให้เรียกใช้ session ได้ทั่วทั้งแอป */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
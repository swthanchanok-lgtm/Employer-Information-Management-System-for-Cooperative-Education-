// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // พอใครเข้าหน้านี้ ให้ดีดไปที่ /login ทันที
  redirect("/login");
}
// 📂 ไฟล์: app/api/upload/route.ts
import { NextResponse } from 'next/server';

// API นี้มีหน้าที่รับไฟล์ แล้วส่ง URL กลับไป (Mock จำลองการทำงาน)
export async function POST(request: Request) {
  try {
    // รับข้อมูลแบบ FormData (เพราะส่งไฟล์มา)
    const formData = await request.formData();
    
    // ดึงไฟล์จาก key ชื่อ 'imageFile' (ที่ตั้งไว้หน้าบ้าน)
    const file = formData.get('imageFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพส่งมา" }, { status: 400 });
    }

    console.log("✅ Server ได้รับไฟล์แล้ว:", file.name, file.type, file.size);

    // =================================================================
    // 🚧 พื้นที่สำหรับเชื่อมต่อ Cloud Storage ของจริง (เช่น Cloudinary, S3) 🚧
    //
    // ในการใช้งานจริง ตรงนี้คุณต้องเขียนโค้ดเพื่อส่งไฟล์ 'file' 
    // ไปยังผู้ให้บริการ Cloud แล้วรอรับ URL จริงๆ กลับมา
    // =================================================================
    
    // ⭐ [MOCK] จำลองว่าอัปโหลดเสร็จแล้ว และได้ URL กลับมา
    // (ผมใช้ URL รูปฟรีมาแทนเพื่อให้เห็นภาพว่าหน้าบ้านจะได้รับ String กลับไป)
    const simulatedCloudUrl = `https://picsum.photos/seed/${file.name}/800/600`;
    
    // ส่ง URL กลับไปให้หน้าบ้าน
    return NextResponse.json({ 
        success: true, 
        url: simulatedCloudUrl 
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" }, { status: 500 });
  }
}
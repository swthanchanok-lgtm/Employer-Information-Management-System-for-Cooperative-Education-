import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
  console.log('🌱 Start seeding...')

  // --- 1. ฟอร์มอาจารย์สอบถามนักศึกษา ---
  const form1 = await prisma.form.create({
    data: {
      title: 'แบบสัมภาษณ์นักศึกษา (โดยอาจารย์นิเทศ)',
      description: 'อาจารย์สอบถามนักศึกษาเพื่อประเมินความเป็นอยู่และทักษะ',
      questions: {
        create: [
          { orderIndex: 1, inputType: 'rating', questionText: 'การจัดการและการสนับสนุน' },
          { orderIndex: 1.1, inputType: 'rating', questionText: 'การประสานงานด้านการจัดการดูแลนักศึกษาในสถานประกอบการ ระหว่างบุคคล และผู้นิเทศงานในสถานประกอบการ' },
          { orderIndex: 1.2, inputType: 'rating', questionText: 'การให้คำแนะนำและการดูแลนักศึกษาของฝ่ายบุคคล (การปฐมนิเทศ การแนะนำระเบียบวินัย การลางาน สวัสดิการ การจ่ายค่าตอบแทน)' },
          { orderIndex: 1.3, inputType: 'rating', questionText: 'บุคลากรในสถานประกอบการ ให้ความสนใจสนับสนุนและให้ความเป็นกันเองกับนักศึกษา' },
          { orderIndex: 2, inputType: 'rating', questionText: 'ปริมาณงานและคุณภาพงานที่นักศึกษาได้รับมอบหมาย' },
          { orderIndex: 2.1, inputType: 'rating', questionText: 'ปริมาณงานที่ได้รับมอบหมาย' },
          { orderIndex: 2.2, inputType: 'rating', questionText: 'คุุณลักษณะงาน' },
          { orderIndex: 2.3, inputType: 'rating', questionText: 'งานที่ได้รับมอบหมายตรงกับสาขาวิชาเอกของนักศึกษา' },
          { orderIndex: 2.4, inputType: 'rating', questionText: 'งานที่ได้รับมอบหมายตรงกับที่สถานประกอบการเสนอไว้' },
          { orderIndex: 2.5, inputType: 'rating', questionText: 'งานที่ได้รับมอบหมายตรงกับความสนใจของนักศึกษา' },
          { orderIndex: 2.6, inputType: 'rating', questionText: 'ความเหมาะสมของหัวข้อรายงานที่นักศึกษาได้รับ' },
          { orderIndex: 3, inputType: 'rating', questionText: 'การมอบหมายงานและนิเทศงานของผู้นิเทศงานในสถานประกอบการ' },
          { orderIndex: 3.1, inputType: 'rating', questionText: 'มีผู้นิเทศงานในสถานประกอบการดูแลนักศึกษาตั้งแต่วันแรกที่เข้าทำงาน' },
          { orderIndex: 3.2, inputType: 'rating', questionText: 'ความรู้และประสบการณ์วิชาชีพของผู้นิเทศงานในสถานประกอบการ' },
          { orderIndex: 3.3, inputType: 'rating', questionText: 'เวลาที่ผู้นิเทศงานในสถานประกอบการให้แก่นักศึกษาด้านการปฏิบัติงาน' },
          { orderIndex: 3.4, inputType: 'rating', questionText: 'เวลาที่ผู้นิเทศงานในสถานประกอบการให้แก่นักศึกษาด้านการเขียนรายงาน' },
          { orderIndex: 3.5, inputType: 'rating', questionText: 'ความสนใจของผู้นิเทศงานในสถานประกอบการต่อการสอนงานและสั่งงาน' },
          { orderIndex: 3.6, inputType: 'rating', questionText: 'การให้ความสำคัญต่อการประเมินผลการปฏิบัติงานและการเขียนรายงานของผู้นิเทศงานสถานประกอบการ' },
          { orderIndex: 3.7, inputType: 'rating', questionText: 'การการจัดทำแผนปฏิบัติงานตลอดระยะเวลาของการปฏิบัติงานให้กับนักศึกษา' },
          { orderIndex: 4, inputType: 'rating', questionText: 'สรุปคุณภาพโดยรวมของสถานประกอบการแห่งนี้' },
          {
            orderIndex: 99, // ให้เลขเยอะๆ จะได้อยู่ท้ายสุดเสมอ
            inputType: 'text',
            questionText: 'หมายเหตุ'
          }
        ],
      },
    },
  })

  // --- 2. ฟอร์มอาจารย์สอบถามพี่เลี้ยง ---
  const form2 = await prisma.form.create({
    data: {
      title: 'แบบสัมภาษณ์พี่เลี้ยง (โดยอาจารย์นิเทศ)',
      description: 'อาจารย์สอบถามพี่เลี้ยงเพื่อติดตามพฤติกรรมนักศึกษา',
      questions: {
        create: [
          { orderIndex: 1, inputType: 'rating', questionText: 'การพัฒนาตัวเอง' },
          { orderIndex: 1.1, inputType: 'rating', questionText: 'บุคลิกภาพ' },
          { orderIndex: 1.2, inputType: 'rating', questionText: 'วุฒิภาวะ' },
          { orderIndex: 1.3, inputType: 'rating', questionText: 'การปรับตัว' },
          { orderIndex: 1.4, inputType: 'rating', questionText: 'การเรียนรู้' },
          { orderIndex: 1.5, inputType: 'rating', questionText: 'การแสดงความคิดเห็น' },
          { orderIndex: 1.6, inputType: 'rating', questionText: 'มนุษย์สัมพันธ์' },
          { orderIndex: 1.7, inputType: 'rating', questionText: 'ทัศนคติ' },
          { orderIndex: 2, inputType: 'rating', questionText: 'การแสดงความมีส่วนร่วมกับองค์กร' },
          { orderIndex: 3, inputType: 'rating', questionText: 'ความประพฤติ คุณธรรม จริยธรรม และกระปฏิบัติตามกฏระเบียบวินัยขององค์กร การลางาน การขาดงาน การแต่งกาย' },
          { orderIndex: 4, inputType: 'rating', questionText: 'ความรู้ความสามารถพื้นฐานที่จำเป็นต่อการปฏิบัติงานที่ได้รับมอบหมายให้สำเร็จ' },
          { orderIndex: 5, inputType: 'rating', questionText: 'ความก้าวหน้าของการจัดทำรายงาน' },
          { orderIndex: 6, inputType: 'rating', questionText: 'สรุปโดยรวมของนักศึกษา' },
          { orderIndex: 7, inputType: 'textarea', questionText: 'ความคิดเห็นเพิ่มเติม' },
          
          {
            orderIndex: 99, // ให้เลขเยอะๆ จะได้อยู่ท้ายสุดเสมอ
            inputType: 'text',
            questionText: 'หมายเหตุ'
          }
        ],
      },
    },
  })

  // --- 3. ฟอร์มพี่เลี้ยงประเมินนักศึกษา ---
  const form3 = await prisma.form.create({
    data: {
      title: 'แบบประเมินความพึงพอใจของสถานประกอบการต่อการรับนักศึกษา',
      description: 'สำหรับพี่เลี้ยงประเมินผลเมื่อสิ้นสุดโครงการ',
      questions: {
        create: [
          { orderIndex: 1, inputType: 'rating', questionText: 'ประโยชน์ที่ได้รับจากนักศึกษาสหกิจศึกษา' },
          { orderIndex: 2, inputType: 'rating', questionText: 'ระดับความพึงพอต่อการปฏิบัติงานสหกิจศึกษาของนักศึกษา' },
          { orderIndex: 3, inputType: 'rating', questionText: 'ความเหมาะสมของระยะเวลาการปฏิบัติงานสหกิจศึกษา' },
          { orderIndex: 4, inputType: 'rating', questionText: 'ความเหมาะสมของช่วงเวลาการปฏิบัติงานสหกิจศึกษา' },
          { orderIndex: 5, inputType: 'rating', questionText: 'ประสิทธิภาพการทำงานของนักศึกษา' },
          { orderIndex: 6, inputType: 'textarea', questionText: 'ความคิดเห็นเพิ่มเติม' },
          {
            orderIndex: 99, // ให้เลขเยอะๆ จะได้อยู่ท้ายสุดเสมอ
            inputType: 'text',
            questionText: 'หมายเหตุ'
          }
        ],
      },
    },
  })

  console.log('✅ Forms created.')

  // ==========================================
  // 🚩 ปรับปรุงส่วนการสร้าง Roles และ Admin ให้ตรงกับ Schema ใหม่
  // ==========================================

  // 1. สร้าง Roles ก่อน (ใช้ upsert เพื่อกันเหนียว)
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  })

  await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } })
  await prisma.role.upsert({ where: { name: 'COURSE_INSTRUCTOR' }, update: {}, create: { name: 'COURSE_INSTRUCTOR' } })
  await prisma.role.upsert({ where: { name: 'SUPERVISOR' }, update: {}, create: { name: 'SUPERVISOR' } })
  await prisma.role.upsert({ where: { name: 'STUDENT' }, update: {}, create: { name: 'STUDENT' } })

  // 2. สร้าง User Admin (ไม่มี password และใช้ roleId)
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      roleId: adminRole.id
    },
    create: {
      username: 'admin',
      name: 'Super Admin',
      email: 'admin@system.com',
      department: 'IT Center',
      roleId: adminRole.id, // ใช้เลข ID จาก Role ที่สร้างด้านบน
    },
  })

  console.log('✅ Created Admin User:', adminUser.username)
  console.log('✅ Seeding finished successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
import Image from "next/image"
// # import Image component ของ Next.js สำหรับแสดงรูปภาพที่ optimize อัตโนมัติ

import Link from "next/link"
// # import Link component ของ Next.js สำหรับลิงก์ระหว่างหน้า

export default function HomePage() {
  // # ประกาศฟังก์ชันคอมโพเนนต์ HomePage (เป็น default export)
  return (
    <div className="font-sans bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* # กำหนดฟอนต์หลัก สีพื้นหลังและสีตัวอักษร รองรับทั้ง light/dark mode */}

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-16 px-6 text-center">
        {/* # ส่วน Hero (หัวเว็บ) พื้นหลังเทาอ่อน/เข้ม ตัวอักษรดำ/ขาว กำหนด padding และจัดกลาง */}
        <div className="max-w-screen-lg mx-auto">
          {/* # กล่องจำกัดความกว้างสูงสุดและจัดกลาง */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ระบบเวชระเบียนสุขภาพอัจฉริยะ
            {/* # ข้อความหัวเรื่องหลัก */}
          </h1>
          <p className="text-lg md:text-xl mb-6">
            ด้วยเทคโนโลยี Blockchain และ AI เพื่อความปลอดภัย โปร่งใส และแม่นยำ
            {/* # คำอธิบายสั้นๆ */}
          </p>
          <div className="space-x-4">
            {/* # กล่องปุ่มลิงก์ มีระยะห่างระหว่างปุ่ม */}
            <Link
              href="/login"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              เข้าสู่ระบบ
              {/* # ปุ่มลิงก์ไปหน้า login */}
            </Link>
            <Link
              href="#features"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-600 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-600"
            >
              เรียนรู้เพิ่มเติม
              {/* # ปุ่มลิงก์ไปยัง section #features */}
            </Link>
          </div>
        </div>
      </section>
      {/* # จบ Hero Section */}

      {/* About Section */}
      {/* # (ยังไม่มีเนื้อหาในส่วนนี้) */}

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100 dark:bg-gray-800 px-6">
        {/* # Section แสดงคุณสมบัติเด่นของระบบ พื้นหลังเทาอ่อน/เข้ม รองรับ dark mode */}
        <h2 className="text-3xl font-bold text-center mb-10">คุณสมบัติเด่นของระบบ</h2>
        {/* # หัวข้อ section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
          {/* # ใช้ grid แบ่งเป็น 1, 2, หรือ 4 คอลัมน์ตามขนาดจอ มีระยะห่างระหว่างกล่อง */}
          <Feature icon="/images/security.png" title="ความปลอดภัยสูง" desc="ข้อมูลเข้ารหัสและจัดเก็บใน Blockchain แบบไม่สามารถแก้ไขได้" />
          {/* # เรียกใช้คอมโพเนนต์ Feature แสดงจุดเด่นเรื่องความปลอดภัย */}
          <Feature icon="/images/ai.png" title="AI วิเคราะห์โรค" desc="ช่วยคาดการณ์ความเสี่ยงจากเวชระเบียนและประวัติผู้ป่วย" />
          {/* # จุดเด่นเรื่อง AI */}
          <Feature icon="/images/records.png" title="เข้าถึงเวชระเบียน" desc="ผู้ป่วยและแพทย์สามารถเรียกดูข้อมูลได้ตลอด 24 ชม." />
          {/* # จุดเด่นเรื่องการเข้าถึงข้อมูล */}
          <Feature icon="/images/contract.png" title="โปร่งใส ตรวจสอบได้" desc="ทุกการเปลี่ยนแปลงบันทึกผ่าน Smart Contract" />
          {/* # จุดเด่นเรื่องความโปร่งใส */}
        </div>
      </section>
      {/* # จบ Features Section */}

      {/* How It Works */}
      <section className="py-16 px-6 max-w-screen-md mx-auto text-center">
        {/* # Section อธิบายขั้นตอนการทำงานของระบบ จัดกลาง กำหนดความกว้างสูงสุด */}
        <h2 className="text-3xl font-bold mb-10 text-blue-700 dark:text-blue-400">
          ระบบทำงานอย่างไร?
          {/* # หัวข้อ section */}
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mx-auto max-w-lg">
          {/* # กล่องแสดงขั้นตอนการทำงาน พื้นหลังขาว/เทาเข้ม มีเงา ขอบมน จัดกลาง */}
          <ol className="space-y-4 text-left text-lg text-gray-800 dark:text-gray-200 list-decimal list-inside">
            {/* # ลิสต์ขั้นตอนแบบเลขเรียงลำดับ มีระยะห่างแต่ละบรรทัด รองรับ dark mode */}
            <li>ผู้ป่วยเข้าสู่ระบบและยืนยันตัวตน</li>
            {/* # ขั้นตอนที่ 1 */}
            <li>ข้อมูลสุขภาพถูกจัดเก็บบน Blockchain</li>
            {/* # ขั้นตอนที่ 2 */}
            <li>AI วิเคราะห์และคาดการณ์โรค</li>
            {/* # ขั้นตอนที่ 3 */}
            <li>โรงพยาบาลอื่นสามารถขออนุญาตเข้าถึงข้อมูล</li>
            {/* # ขั้นตอนที่ 4 */}
          </ol>
        </div>
      </section>
      {/* # จบ How It Works Section */}
    </div>
  )
  // # จบฟังก์ชัน HomePage
}

function Feature({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  // # ประกาศฟังก์ชันคอมโพเนนต์ Feature รับ prop สามตัว (icon, title, desc)
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition text-center ">
      {/* # กล่องแสดงแต่ละคุณสมบัติเด่น พื้นหลังขาว/เทาเข้ม ขอบมน มีเงา จัดกลาง */}
      <Image src={icon} alt={title} width={64} height={64} className="mx-auto mb-4" />
      {/* # แสดงไอคอนของคุณสมบัติเด่น */}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {/* # แสดงชื่อคุณสมบัติเด่น */}
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
      {/* # แสดงคำอธิบายคุณสมบัติเด่น รองรับ dark mode */}
    </div>
  )
  // # จบฟังก์ชัน Feature
}

//
// ---------------------------------------------------------------
// # สรุปการทำงานของ page.tsx:
// # - แสดงหน้าแรกของระบบเวชระเบียนสุขภาพอัจฉริยะ
// # - มี Hero Section แนะนำระบบและปุ่มเข้าสู่ระบบ/เรียนรู้เพิ่มเติม
// # - Section แสดงคุณสมบัติเด่นของระบบ (Feature) โดยใช้คอมโพเนนต์ Feature และส่ง prop icon, title, desc
// # - Section อธิบายขั้นตอนการทำงานของระบบแบบลำดับขั้น
// # - ใช้ Tailwind CSS กำหนด style ทั้งหมด รองรับทั้ง light/dark mode
// # - ไม่มีการรับ prop หรือส่งค่ากลับออกไปนอก component
// # - ตัวแปรที่ใช้: ไม่มี state หรือ prop ภายใน HomePage, มี prop ใน Feature
// # - การไหลของข้อมูล: ข้อมูลแต่ละ Feature ถูกส่งผ่าน prop ไปยังคอมโพเนนต์ Feature เพื่อแสดงผล
import Image from "next/image"
import Link from "next/link"



export default function HomePage() {
  return (
    <div className="font-sans bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-16 px-6 text-center">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ระบบเวชระเบียนสุขภาพอัจฉริยะ
          </h1>
          <p className="text-lg md:text-xl mb-6">
            ด้วยเทคโนโลยี Blockchain และ AI เพื่อความปลอดภัย โปร่งใส และแม่นยำ
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="#features"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-600 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-600"
            >
              เรียนรู้เพิ่มเติม
            </Link>
          </div>
        </div>
      </section>
      


      {/* About Section */}



      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100 dark:bg-gray-800 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">คุณสมบัติเด่นของระบบ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
          <Feature icon="/images/security.png" title="ความปลอดภัยสูง" desc="ข้อมูลเข้ารหัสและจัดเก็บใน Blockchain แบบไม่สามารถแก้ไขได้" />
          <Feature icon="/images/ai.png" title="AI วิเคราะห์โรค" desc="ช่วยคาดการณ์ความเสี่ยงจากเวชระเบียนและประวัติผู้ป่วย" />
          <Feature icon="/images/records.png" title="เข้าถึงเวชระเบียน" desc="ผู้ป่วยและแพทย์สามารถเรียกดูข้อมูลได้ตลอด 24 ชม." />
          <Feature icon="/images/contract.png" title="โปร่งใส ตรวจสอบได้" desc="ทุกการเปลี่ยนแปลงบันทึกผ่าน Smart Contract" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 max-w-screen-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-700 dark:text-blue-400">
          ระบบทำงานอย่างไร?
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mx-auto max-w-lg">
          <ol className="space-y-4 text-left text-lg text-gray-800 dark:text-gray-200 list-decimal list-inside">
            <li>ผู้ป่วยเข้าสู่ระบบและยืนยันตัวตน</li>
            <li>ข้อมูลสุขภาพถูกจัดเก็บบน Blockchain</li>
            <li>AI วิเคราะห์และคาดการณ์โรค</li>
            <li>โรงพยาบาลอื่นสามารถขออนุญาตเข้าถึงข้อมูล</li>
          </ol>
        </div>
      </section>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition text-center ">
      <Image src={icon} alt={title} width={64} height={64} className="mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  )
}

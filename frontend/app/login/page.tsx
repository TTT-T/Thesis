'use client' // บอก Next.js ว่านี่คือ Client Component (ใช้ useState/useEffect ได้)

// ===== นำเข้า module ต่าง ๆ ที่จำเป็น =====
import { useState } from 'react'               // สำหรับเก็บ state
import Link from 'next/link'                   // ลิงก์ภายในแอปแบบ client-side
import Image from 'next/image'                 // จัดการรูปภาพแบบ optimized
import { login } from '@/lib/auth'             // ฟังก์ชัน login ที่เรียก API backend
import { useRouter } from 'next/navigation'    // ใช้เปลี่ยนหน้า
import { Toaster, toast } from 'react-hot-toast' // แสดง popup แจ้งเตือน

// ฟังก์ชันหลักของหน้าล็อกอิน
export default function LoginPage() {
  const router = useRouter() // ใช้สำหรับเปลี่ยนหน้าเมื่อ login สำเร็จ

  // สร้าง state สำหรับ email, password, และ error message
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // ฟังก์ชันที่จะทำงานเมื่อกด submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // ป้องกัน reload หน้า

    try {
      const res = await login(email, password) // เรียก login() จาก lib/auth
      console.log("Token after login:", res.access_token) // แสดง token ที่ได้จาก backend

      localStorage.setItem("access_token", res.access_token) // บันทึก token ลง localStorage

      router.push("/dashboard") // เปลี่ยนหน้าไป /dashboard
    } catch (err: any) {
      setError(err.message) // ถ้า error → เก็บข้อความไว้ใน error
    }
  }

  // ส่วน UI ของหน้า login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-6">
      <Toaster position="top-center" /> {/* Toast แจ้งเตือนกลางจอ */}

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {/* หัวเรื่อง */}
        <div className="text-center mb-6">
          <Image src="/images/login-icon.png" alt="login icon" width={60} height={60} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">ระบบเวชระเบียนสุขภาพอัจฉริยะ</p>
        </div>

        {/* แบบฟอร์ม login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder:text-gray-500 
                         dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white text-black placeholder:text-gray-500 
                         dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          {/* แสดง error หาก login ไม่สำเร็จ */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ลิงก์ไปหน้าสมัครสมาชิก */}
        <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          ยังไม่มีบัญชี?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  )
}

/*
 สรุปการทำงานของ LoginPage:
- ใช้ useState เก็บ email, password, error
- เมื่อ submit:
   → เรียก `login()` ที่เชื่อมต่อกับ backend
   → ถ้าสำเร็จ → บันทึก JWT ลง localStorage และไปหน้า /dashboard
   → ถ้าไม่สำเร็จ → แสดง error

- UI ใช้ Tailwind CSS รองรับ dark mode
- ใช้ react-hot-toast แสดงผลแจ้งเตือน
- เหมาะสำหรับระบบ login ของแอปสุขภาพที่มีการจัดการ JWT
*/

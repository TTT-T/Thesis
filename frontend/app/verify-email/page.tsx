'use client' // บอก Next.js ว่านี่คือ Client Component (ใช้ useEffect/useState ได้)

import { useEffect, useState } from 'react' // import hook สำหรับจัดการสถานะและ lifecycle
import { useSearchParams, useRouter } from 'next/navigation' // ใช้จัดการ query params และเปลี่ยนหน้า

//  ฟังก์ชันหลักของหน้านี้ คือหน้า "ยืนยันอีเมล"
export default function VerifyEmailPage() {
  const searchParams = useSearchParams() // ใช้ดึงค่าจาก URL query string เช่น token=xxx
  const router = useRouter() // ใช้เปลี่ยนหน้าแบบ client-side (ไม่ reload)
  const token = searchParams.get('token') // ดึงค่า token จาก query string เช่น /verify-email?token=abc123

  // สถานะข้อความที่จะแสดงบนหน้าจอ เช่น "กำลังยืนยัน", "สำเร็จ", "ล้มเหลว"
  const [status, setStatus] = useState('⏳ กำลังยืนยันอีเมล...')

  //  ตรวจสอบ token เมื่อ component โหลด
  useEffect(() => {
    // สร้างฟังก์ชัน async ยืนยันอีเมล
    const verify = async () => {
      try {
        // เรียก API ไปที่ FastAPI endpoint /verify-email?token=...
        const res = await fetch(`http://localhost:8000/verify-email?token=${token}`)

        // แปลง response เป็น JSON
        const data = await res.json()

        // ถ้าการยืนยันสำเร็จ (res.ok === true)
        if (res.ok) {
          setStatus(' ยืนยันอีเมลเรียบร้อยแล้ว! กำลังพาไปหน้าล็อกอิน...')

          // รอ 3 วินาทีเพื่อให้ผู้ใช้เห็นข้อความ → แล้วค่อยพาไปหน้า login
          setTimeout(() => {
            router.push('/login') // ไปหน้า login
          }, 3000)
        } else {
          // ถ้า token ไม่ถูกต้อง หรือหมดอายุ → แสดงข้อความ error
          setStatus(` ยืนยันล้มเหลว: ${data.detail}`)
        }
      } catch {
        // ถ้า fetch ไม่สำเร็จ เช่น server ไม่ออนไลน์
        setStatus(' ไม่สามารถติดต่อเซิร์ฟเวอร์ได้')
      }
    }

    // ถ้ามี token → เรียกฟังก์ชัน verify()
    if (token) verify()
  }, [token, router]) // รัน useEffect ใหม่หาก token หรือ router เปลี่ยน

  //  แสดงข้อความสถานะตรงกลางหน้าจอ (มี dark mode)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-xl font-semibold text-center text-blue-800 dark:text-blue-300">
      {status}
    </div>
  )
}

/*
 สรุปการทำงานของ VerifyEmailPage:
- ใช้ `useSearchParams()` เพื่ออ่าน token จาก URL เช่น `/verify-email?token=abc123`
- ใช้ `useEffect()` ตรวจสอบ token และเรียก API `/verify-email?token=...` ไปยัง backend
- ถ้าสำเร็จ → แสดงข้อความสำเร็จ และพาไปหน้า /login หลัง 3 วินาที
- ถ้าไม่สำเร็จ → แสดงข้อความ error (เช่น token หมดอายุ)
- รองรับ dark mode และจัดข้อความให้อยู่ตรงกลางจอ

 เหมาะกับการใช้เป็นหน้า Landing หลังคลิกลิงก์ยืนยันจากอีเมล
*/

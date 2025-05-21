//  ระบุว่าเป็น Client Component เพื่อให้สามารถใช้ useEffect/useState ได้
'use client'

//  import useEffect และ useState สำหรับจัดการ lifecycle และ state
import { useEffect, useState } from 'react'

//  import useRouter สำหรับเปลี่ยนหน้าใน Next.js (Client-side navigation)
import { useRouter } from 'next/navigation'

//  ฟังก์ชันหลักของ DashboardPage
export default function DashboardPage() {
  const router = useRouter() // ใช้สำหรับเปลี่ยนหน้า

  //  กำหนด state สำหรับข้อความ, บทบาท, และ error
  const [msg, setMsg] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  //  เมื่อ component โหลด ให้ตรวจสอบ token และโหลดข้อมูล
  useEffect(() => {
    //  ดึง access_token จาก localStorage
    const token = localStorage.getItem('access_token')

    //  ถ้าไม่มี token → ให้ redirect ไปหน้า login
    if (!token) {
      router.push('/login')
      return
    }

    //  ถ้ามี token → เรียก API /dashboard ที่ backend
    fetch('http://localhost:8000/dashboard', {
      headers: { Authorization: `Bearer ${token}` } // ส่ง token แบบ Bearer
    })
      .then(async res => {
        if (res.status === 403) {
          //  ถ้าไม่มีสิทธิ์เข้าถึง (token ถูกต้องแต่ role ไม่ผ่าน) → แจ้งเตือน และ redirect
          setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
          setTimeout(() => router.push('/login'), 2000)
        } else if (res.ok) {
          //  ถ้าโหลดสำเร็จ → แสดงข้อมูลข้อความและ role
          const data = await res.json()
          setMsg(data.msg)
          setRole(data.role)
        } else {
          //  กรณีอื่น ๆ ที่ไม่สำเร็จ
          throw new Error('โหลดข้อมูลล้มเหลว')
        }
      })
      .catch(() => {
        //  หากเกิด error จาก fetch เช่น server ไม่ตอบกลับ
        setError('ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์')
      })
  }, [router]) //  ให้ useEffect ทำงานเมื่อ `router` เปลี่ยน (แต่จริง ๆ จะทำครั้งเดียวตอนโหลด)

  //  ส่วนแสดงผลหน้าจอ
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">แดชบอร์ดผู้ดูแล</h1>

      {/* แสดง error ถ้ามี */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ถ้าไม่มี error แสดงข้อมูลผู้ใช้ */}
      {!error && (
        <div>
          <p>{msg}</p>
          <p>Role: {role}</p>
        </div>
      )}
    </div>
  )
}

/*
หน้าหลักแดชบอร์ดนี้จะโหลดเฉพาะเมื่อผู้ใช้มี token แล้วเท่านั้น

ขั้นตอนการทำงาน:
1. เมื่อโหลด component → ตรวจสอบ token จาก localStorage
2. ถ้าไม่มี token → redirect ไปที่ /login ทันที
3. ถ้ามี token → ส่ง token ไปที่ backend (เช่น FastAPI) ผ่าน Header แบบ Bearer Token
4. ถ้า token ใช้งานได้ และ role ถูกต้อง → แสดงข้อมูล msg และ role
5. ถ้า token ผิดหรือไม่มีสิทธิ์ → แสดง error แล้ว redirect กลับไปหน้า login หลัง 2 วินาที
6. ถ้า fetch ล้มเหลว → แสดงข้อความ error

เหมาะสำหรับ:
- ใช้ควบคุมการเข้าถึงหน้าแดชบอร์ดตามสิทธิ์
- ป้องกันผู้ใช้ที่ไม่ได้ login เข้าถึงข้อมูลภายในระบบ
*/


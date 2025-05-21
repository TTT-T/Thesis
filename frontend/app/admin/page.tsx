'use client'

// นำเข้า useEffect และ useState สำหรับจัดการ state และ lifecycle
import { useEffect, useState } from 'react'

// ฟังก์ชันหลักของหน้าแก้ไข Role
export default function EditUserRolePage() {
  // สร้าง state users สำหรับเก็บข้อมูลผู้ใช้งาน
  const [users, setUsers] = useState<any[]>([])

  // สร้าง state message สำหรับแสดงข้อความแจ้งเตือนเมื่อเปลี่ยน role สำเร็จ/ล้มเหลว
  const [message, setMessage] = useState('')

  // เมื่อ component โหลดเสร็จ ให้ดึงข้อมูลผู้ใช้ทั้งหมด
  useEffect(() => {
    const token = localStorage.getItem('access_token') // ดึง token
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }, // แนบ token แบบ Bearer ไปด้วย
    })
      .then((res) => res.json()) // แปลงผลลัพธ์เป็น JSON
      .then((data) => setUsers(data)) // เก็บข้อมูลที่ได้ไว้ใน state users
  }, [])

  // ฟังก์ชันเรียกเมื่อมีการเปลี่ยนแปลง role ของผู้ใช้คนใดคนหนึ่ง
  const handleRoleChange = async (id: number, role: string) => {
    const token = localStorage.getItem('access_token') // ดึง token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`, {
      method: 'PATCH', // ใช้ method PATCH
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }), // ส่ง role ใหม่ไปใน body
    })
    if (res.ok) {
      setMessage('✅ เปลี่ยน role สำเร็จ') // หากสำเร็จแสดงข้อความนี้
    } else {
      setMessage('❌ ไม่สามารถเปลี่ยน role ได้') // หากไม่สำเร็จแสดงข้อความนี้
    }
  }

  // ส่วน UI ของ component
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-300">แก้ไขบทบาทผู้ใช้งาน</h1>
        {message && <p className="mb-4 text-green-700 dark:text-green-400">{message}</p>}

        <table className="w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
              <th className="border px-4 py-2">ชื่อผู้ใช้</th>
              <th className="border px-4 py-2">อีเมล</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">เปลี่ยน Role</th>
            </tr>
          </thead>
          <tbody>
            {/* ตรวจสอบว่า users เป็น array และแสดงข้อมูลแต่ละรายการ */}
            {Array.isArray(users) && users.map((user) => (
              <tr key={user.id} className="bg-white dark:bg-gray-800">
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border p-1 bg-white dark:bg-gray-700 dark:text-white rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/*
📦 สรุปการทำงานของ component EditUserRolePage:

- ดึง token จาก localStorage เพื่อใช้ดึงข้อมูลผู้ใช้ทั้งหมดจาก backend
- users แต่ละคนมีข้อมูล เช่น id, username, email, role
- ผู้ดูแลระบบสามารถเปลี่ยน role ได้ทันทีจาก dropdown
- เมื่อมีการเปลี่ยน role → เรียก API PATCH เพื่ออัปเดต role
- มีข้อความแจ้งผลลัพธ์ให้ผู้ใช้ทราบ (สำเร็จ/ล้มเหลว)
- รองรับ dark mode เต็มรูปแบบ ด้วย Tailwind CSS เช่น dark:bg-gray-800, dark:text-white
*/
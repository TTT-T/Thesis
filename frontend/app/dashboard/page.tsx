'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [msg, setMsg] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('http://localhost:8000/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 403) {
          setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
          setTimeout(() => router.push('/login'), 2000)
        } else if (res.ok) {
          const data = await res.json()
          setMsg(data.msg)
          setRole(data.role)
        } else {
          throw new Error('โหลดข้อมูลล้มเหลว')
        }
      })
      .catch(() => setError('ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์'))
  }, [router])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">แดชบอร์ดผู้ดูแล</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <div>
          <p>{msg}</p>
          <p>Role: {role}</p>
        </div>
      )}
    </div>
  )
}

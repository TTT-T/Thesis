'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('กำลังยืนยัน...')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:8000/verify-email?token=${token}`)
        const data = await res.json()
        if (res.ok) {
          setStatus('✅ ยืนยันอีเมลเรียบร้อยแล้ว! กรุณาเข้าสู่ระบบ')
        } else {
          setStatus(`❌ ยืนยันล้มเหลว: ${data.detail}`)
        }
      } catch (err) {
        setStatus('❌ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้')
      }
    }

    if (token) verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-center">
      {status}
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: ส่งคำขอล็อกอินไป backend
    console.log('Logging in with:', username, password)
    // จำลองการล็อกอินสำเร็จ
    localStorage.setItem('access_token', 'mock-token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 px-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <Image src="/images/login-icon.png" alt="login icon" width={60} height={60} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">ระบบเวชระเบียนสุขภาพอัจฉริยะ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          ยังไม่มีบัญชี? <Link href="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  )
}

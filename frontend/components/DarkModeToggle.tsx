'use client'
// # บอก Next.js ว่าไฟล์นี้เป็น client component (ใช้ React hooks ได้)

import { useEffect, useState } from 'react'
// # import useEffect และ useState สำหรับจัดการ state และ lifecycle ใน React

export default function DarkModeToggle() {
  // # ประกาศฟังก์ชันคอมโพเนนต์ DarkModeToggle

  const [isDark, setIsDark] = useState(false)
  // # สร้าง state ชื่อ isDark สำหรับเก็บสถานะธีม (true = dark, false = light) ค่าเริ่มต้นคือ false

  useEffect(() => {
    // # ใช้ useEffect เพื่อรันโค้ดเมื่อ component ถูก mount
    const dark = localStorage.getItem('theme') === 'dark'
    // # อ่านค่าจาก localStorage ถ้า theme เป็น 'dark' จะได้ true, ถ้าไม่ใช่จะได้ false
    document.documentElement.classList.toggle('dark', dark)
    // # เพิ่มหรือลบ class 'dark' ที่ <html> ตามค่าของ dark (ถ้า dark เป็น true จะเพิ่ม, ถ้า false จะลบ)
    setIsDark(dark)
    // # อัปเดต state isDark ให้ตรงกับค่าที่อ่านได้จาก localStorage
  }, [])
  // # [] ทำให้ useEffect นี้รันครั้งเดียวตอน mount

  const toggleTheme = () => {
    // # ฟังก์ชันสำหรับสลับธีมเมื่อผู้ใช้คลิกปุ่ม
    const newTheme = !isDark
    // # สลับค่าจาก isDark (ถ้าเดิมเป็น true จะเป็น false, ถ้าเดิมเป็น false จะเป็น true)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    // # บันทึกค่า theme ใหม่ลงใน localStorage ('dark' หรือ 'light')
    document.documentElement.classList.toggle('dark', newTheme)
    // # เพิ่มหรือลบ class 'dark' ที่ <html> ตามค่าใหม่
    setIsDark(newTheme)
    // # อัปเดต state isDark ให้ตรงกับธีมใหม่
  }

  return (
    <button
      onClick={toggleTheme}
      // # เมื่อคลิกปุ่มจะเรียก toggleTheme เพื่อสลับธีม
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      // # กำหนด style ปุ่มให้รองรับทั้ง light/dark mode ด้วย tailwind
      aria-label="Toggle Dark Mode"
      // # เพิ่ม aria-label เพื่อช่วยให้เข้าถึงได้สำหรับผู้ใช้ screen reader
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
      {/* # แสดงไอคอนและข้อความตามธีมปัจจุบัน (☀️ สำหรับ light, 🌙 สำหรับ dark) */}
    </button>
  )
}

//
// ---------------------------------------------------------------
// # สรุปการทำงานของ DarkModeToggle.tsx:
// # - แสดงปุ่มสำหรับสลับธีมระหว่าง light/dark mode
// # - ใช้ useState เก็บสถานะธีมปัจจุบัน (isDark)
// # - เมื่อ component mount จะอ่านค่าธีมจาก localStorage และอัปเดต class 'dark' ที่ <html>
// # - เมื่อคลิกปุ่มจะสลับธีม, อัปเดต localStorage, อัปเดต class 'dark' ที่ <html> และอัปเดต state
// # - ตัวแปร isDark ถูกใช้กำหนดข้อความและไอคอนบนปุ่ม
// # - ไม่มีการรับ prop หรือส่งค่ากลับออกไปนอก component
// # - การเปลี่ยนธีมมีผลกับ Tailwind CSS ที่ใช้ class 'dark' ในการเปลี่ยน style
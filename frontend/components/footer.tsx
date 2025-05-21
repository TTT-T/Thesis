'use client' 
// # บอก Next.js ว่าไฟล์นี้เป็น client component (ใช้ React hooks ได้)

import { useEffect, useState } from 'react'
// # import useEffect และ useState สำหรับจัดการ state และ lifecycle ใน React

import ClientWrapper from './ClientWrapper'
// # import ClientWrapper (component สำหรับ wrap อื่นๆ ให้ทำงานฝั่ง client)

import DarkModeToggle from './DarkModeToggle'
// # import ปุ่มสลับ dark mode

export default function Footer() {
  // # ประกาศฟังก์ชันคอมโพเนนต์ Footer

  const [dateString, setDateString] = useState('')
  // # สร้าง state ชื่อ dateString สำหรับเก็บวันที่ (ค่าเริ่มต้นเป็น string ว่าง)
  const [timeString, setTimeString] = useState('')
  // # สร้าง state ชื่อ timeString สำหรับเก็บเวลา (ค่าเริ่มต้นเป็น string ว่าง)

  useEffect(() => {
    // # ใช้ useEffect เพื่อรันโค้ดเมื่อ component ถูก mount
    const interval = setInterval(() => {
      // # สร้าง interval ให้ทำงานทุก 1 วินาที
      const now = new Date()
      // # สร้างอ็อบเจกต์วันที่ปัจจุบัน
      setDateString(now.toLocaleDateString('th-TH'))
      // # แปลงวันที่เป็น string รูปแบบไทย แล้วเก็บใน dateString
      setTimeString(now.toLocaleTimeString('th-TH'))
      // # แปลงเวลาเป็น string รูปแบบไทย แล้วเก็บใน timeString
    }, 1000)

    return () => clearInterval(interval)
    // # cleanup: ลบ interval เมื่อ component ถูก unmount
  }, [])
  // # [] ทำให้ useEffect นี้รันครั้งเดียวตอน mount

  return (
    <footer className="w-full bg-gray-900 text-white text-sm py-4 px-6 ">
      {/* # สร้าง footer กำหนด style ด้วย tailwind (พื้นหลังดำ ตัวอักษรขาว ขนาดเล็ก) */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2">
        {/* # กล่องหลักของ footer ใช้ flex แยกแนวตั้ง/แนวนอนตามขนาดจอ */}
        <div>
          <p>Bachelor of Engineering (Computer Engineering and IoT Systems)</p>
          {/* # ข้อความแสดงชื่อหลักสูตร */}
          <p>ระบบเวชระเบียนสุขภาพอัจฉริยะ | Smart Health Record</p>
          {/* # ข้อความแสดงชื่อระบบ */}
        </div>
        <div className="flex items-center gap-4">
          {/* # กล่องสำหรับแสดง IP, วันที่, เวลา, และปุ่ม dark mode */}
          <span>IP: 127.0.0.1</span>
          {/* # แสดง IP (hardcoded) */}
          <span>{dateString} {timeString}</span>
          {/* # แสดงวันที่และเวลาปัจจุบัน (อัปเดตทุกวินาที) */}
          <ClientWrapper>
            <DarkModeToggle />
            {/* # ปุ่มสลับ dark mode ห่อด้วย ClientWrapper */}
          </ClientWrapper>
        </div>
      </div>
    </footer>
  )
}

//
// ---------------------------------------------------------------
// # สรุปการทำงานของ footer.tsx:
// # - แสดง footer ที่มีชื่อหลักสูตร ชื่อระบบ IP (127.0.0.1) วันที่และเวลาปัจจุบัน และปุ่มสลับ dark mode
// # - ใช้ useState สองตัว (dateString, timeString) สำหรับเก็บวันที่และเวลา
// # - ใช้ useEffect สร้าง interval เพื่ออัปเดตวันที่และเวลาทุกวินาที
// # - เมื่อ component ถูก unmount จะ clear interval เพื่อป้องกัน memory leak
// # - วันที่และเวลาแสดงผลในรูปแบบไทย (th-TH)
// # - ปุ่ม DarkModeToggle ถูกห่อด้วย ClientWrapper เพื่อให้แน่ใจว่าทำงานฝั่ง client
// # - ไม่มีการรับ prop หรือส่งค่ากลับออกไปนอก component
// # - ตัวแปร dateString, timeString ถูกอัปเดตและนำไปแสดงใน footer เท่านั้น
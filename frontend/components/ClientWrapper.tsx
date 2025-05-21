'use client'
// # บอก Next.js ว่าไฟล์นี้เป็น client component (ใช้ React hooks ได้)

export default function ClientWrapper({ children }: { children?: React.ReactNode }) {
  // # ประกาศฟังก์ชันคอมโพเนนต์ ClientWrapper รับ prop ชื่อ children (ReactNode หรือ undefined)
  return <>{children}</>
  // # แสดงผล children ที่รับเข้ามา โดยไม่เพิ่ม element ใดๆ (React Fragment)
}

//
// ---------------------------------------------------------------
// # สรุปการทำงานของ ClientWrapper.tsx:
// # - เป็นคอมโพเนนต์ที่ใช้ wrap องค์ประกอบอื่นๆ เพื่อบังคับให้ render ฝั่ง client (เช่นใน Next.js)
// # - รับ prop ชื่อ children (ReactNode) แล้วแสดง children เหล่านั้นออกไปตรงๆ
// # - ไม่เปลี่ยนแปลงหรือจัดการค่าใดๆ แค่ส่งผ่าน children
// # - ไม่มีการรับหรือส่งค่าระหว่างตัวแปรอื่นๆ
// # - ใช้ React Fragment (<></>) เพื่อไม่สร้าง DOM element เพิ่มเติม
// # - เหมาะสำหรับใช้ใน Next.js หรือ React ที่ต้องการให้คอมโพเนนต์ทำงานฝั่ง client
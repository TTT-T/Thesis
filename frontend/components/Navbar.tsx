"use client"; // # บอก Next.js ว่าไฟล์นี้เป็น client component (ใช้ React hooks ได้)

import Link from "next/link"; // # import Link สำหรับลิงก์ระหว่างหน้าใน Next.js
import { useState } from "react"; // # import useState สำหรับสร้าง state ใน React
import DarkModeToggle from './DarkModeToggle' // # import ปุ่มสลับ dark mode (แต่ยังไม่ได้ใช้ใน component นี้)

export default function Navbar() { // # ประกาศฟังก์ชันคอมโพเนนต์ Navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // # สร้าง state ชื่อ isMobileMenuOpen (ค่าเริ่มต้น false) สำหรับควบคุมการเปิด/ปิดเมนูมือถือ

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // # ฟังก์ชันสลับค่า isMobileMenuOpen (true/false)
  };

  // Navigation items array
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];
  // # สร้าง array ของเมนูหลักแต่ละอัน (ชื่อและลิงก์)

  return (
    <div>
      <nav className="block w-full max-w-screen px-4 py-4 mx-auto bg-white bg-opacity-90 sticky top-3 shadow lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
        {/* # สร้าง navbar หลัก กำหนด style ด้วย tailwind (sticky, blur, shadow ฯลฯ) */}
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          {/* # กล่องหลักของ navbar จัด layout ด้วย flex */}
          <Link
            href="/"
            className="mr-4 block cursor-pointer py-1.5 text-red-600 font-bold text-2xl"
          >
            NEXTNEWS
            {/* # โลโก้หรือชื่อเว็บ ลิงก์กลับหน้าแรก */}
          </Link>

          <div className="lg:hidden">
            {/* # ปุ่ม hamburger menu แสดงเฉพาะบน mobile (ซ่อนบนจอใหญ่) */}
            <button
              className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={toggleMobileMenu}
              type="button"
            >
              {/* # ปุ่มเปิด/ปิดเมนูมือถือ เรียก toggleMobileMenu เมื่อคลิก */}
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                  {/* # ไอคอน hamburger (3 ขีด) */}
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 min-h-screen w-64 bg-slate-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden z-50`}
          >
            {/* # เมนูมือถือ (side menu) แสดง/ซ่อนด้วย isMobileMenuOpen */}
            <div className="flex flex-row items-center border-b pb-4">
              <Link
                href="/"
                className="cursor-pointer text-red-600 font-bold text-xl pt-4 ps-4"
              >
                NEXTNEWS
                {/* # โลโก้ในเมนูมือถือ */}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-500"
              >
                {/* # ปุ่มปิดเมนูมือถือ (ไอคอน X) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                  {/* # ไอคอน X */}
                </svg>
              </button>
            </div>
            <ul className="flex flex-col h-full gap-4 p-4">
              {/* # รายการเมนูใน mobile */}
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2 text-slate-600 hover:text-red-500"
                >
                  <Link onClick={() => {setIsMobileMenuOpen(false);}} href={item.href} className="flex items-center">
                    {item.name}
                  </Link>
                  {/* # ลิงก์เมนูแต่ละอัน ปิดเมนูเมื่อคลิก */}
                </li>
              ))}
              <li className="mt-4">
                <button className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-500">
                  Login
                </button>
                {/* # ปุ่ม Login ใน mobile menu */}
              </li>
            </ul>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            {/* # เมนูหลักสำหรับจอใหญ่ (desktop) */}
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2 text-slate-600 hover:text-red-500"
                >
                  <Link href={item.href} className="flex items-center">
                    {item.name}
                  </Link>
                  {/* # ลิงก์เมนูแต่ละอันใน desktop */}
                </li>
              ))}
              <li>
                <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 rounded-md">
                  Login
                </button>
                {/* # ปุ่ม Login ใน desktop menu */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

//
// ---------------------------------------------------------------
// # สรุปการทำงานของ Navbar.tsx:
// # - แสดง Navbar ที่ responsive รองรับทั้ง mobile และ desktop
// # - ใช้ useState เพื่อควบคุมการเปิด/ปิดเมนูมือถือ (isMobileMenuOpen)
// # - มีเมนูหลัก (Home, About, News, Contact) และปุ่ม Login ทั้งใน mobile และ desktop
// # - เมนูมือถือจะแสดงแบบ side menu เลื่อนเข้า/ออกด้วย transition
// # - เมื่อคลิกลิงก์ใน mobile menu จะปิดเมนูอัตโนมัติ
// # - ใช้ Tailwind CSS กำหนด style ทั้งหมด
// # - ตัวแปร navItems ถูก map เพื่อสร้างเมนูอัตโนมัติ
// # - ไม่มีการส่งค่าระหว่าง component อื่น ยกเว้น state ภายใน Navbar เอง
// # - ยังไม่ได้ใช้งาน DarkModeToggle ที่ import มา
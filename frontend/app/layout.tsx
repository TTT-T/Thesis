// นำเข้า React (จำเป็นสำหรับการใช้ JSX)
import React from "react";

// นำเข้า type `Metadata` จาก Next.js สำหรับกำหนด metadata เช่น title, description ฯลฯ
import type { Metadata } from "next";

// นำเข้า font จาก Google Fonts ผ่าน next/font (Geist และ Geist_Mono เป็นฟอนต์จาก Vercel)
import { Geist, Geist_Mono } from "next/font/google";

// นำเข้า CSS ทั่วไปของแอปพลิเคชัน (global stylesheet)
import "../styles/globals.css";

// นำเข้า Navbar ซึ่งเป็นคอมโพเนนต์เมนูด้านบน
import Navbar from "../components/Navbar";

// นำเข้า Footer ซึ่งเป็นคอมโพเนนต์ท้ายหน้า
import Footer from "../components/footer";

// นำเข้า ClientWrapper ซึ่งใช้เพื่อ wrap components ที่ต้องใช้ useEffect/useState (อาจทำให้เป็น client component)
import ClientWrapper from "../components/ClientWrapper";

import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'

//  โหลดฟอนต์ Geist Sans แล้วตั้งชื่อ variable CSS สำหรับใช้งานภายหลัง
const geistSans = Geist({
  subsets: ["latin"], // ใช้ subset ภาษาละตินเท่านั้น (ลดขนาดฟอนต์)
  variable: "--font-geist-sans", // สร้างตัวแปร CSS ไว้สำหรับเรียกใช้ใน global style
});

//  โหลดฟอนต์ Geist Mono สำหรับใช้เป็นฟอนต์แบบ Monospace (เช่น code)
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

//  กำหนด Metadata ของหน้าเว็บ (จะถูกรวมอัตโนมัติเป็น <title> และ <meta name="description">)
export const metadata: Metadata = {
  title: "ระบบเวชระเบียนสุขภาพ",
  description: "ระบบเวชระเบียนสุขภาพอิเล็กทรอนิกส์ด้วยบล็อกเชน",
};

//  ฟังก์ชันหลักที่ Export ออกมาเป็น Layout หลักของแอป (App Router ใช้ RootLayout เป็น entry layout)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    //  แสดง HTML ภาษาไทย
    <html lang="th">
      {/* body ที่มีความสูงขั้นต่ำเต็มหน้าจอ และใช้ flex layout แบบ column */}
      <body className="min-h-screen flex flex-col"><Toaster position="top-center" />
        {/* Navbar แสดงด้านบนทุกหน้า */}
        <Navbar />

        {/* ส่วนหลักของหน้าจะเปลี่ยนไปตาม route โดยใช้ children ที่ Next.js ส่งมา */}
        <main className="flex-grow">{children}</main>

        {/* Footer แสดงด้านล่างทุกหน้า */}
        <Footer />
      </body>
    </html>
  );
}


/*
โค้ดนี้เป็น layout หลักของแอปพลิเคชันใน Next.js (App Router)
มีหน้าที่กำหนดโครงสร้างพื้นฐานของทุกหน้า เช่น HTML, BODY, Navbar, Footer และโหลดฟอนต์รวมถึง CSS ทั่วไป

โครงสร้างโดยรวม:
- ใช้ <html lang="th"> เพื่อรองรับภาษาไทย
- <body> ใช้ Flex layout จัดวาง Navbar, เนื้อหาหลัก (children), และ Footer
- นำเข้าและใช้ฟอนต์ Google (Geist, Geist_Mono) พร้อมกำหนดตัวแปร CSS
- กำหนด metadata เช่น title และ description สำหรับ SEO
- children จะเป็นคอนเทนต์ของแต่ละหน้า เช่น /register, /dashboard ฯลฯ

องค์ประกอบหลัก:
- Navbar: เมนูด้านบนของเว็บ
- Footer: ท้ายหน้าของเว็บ
- children: เนื้อหาของหน้าที่เปลี่ยนไปตาม routing

ข้อดี:
- ทำให้โครงสร้างหน้าเว็บมีความสม่ำเสมอ
- ใช้ layout นี้ร่วมกันได้ทุกหน้า
- ใช้งานง่ายและยืดหยุ่น
*/

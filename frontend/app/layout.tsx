import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import ClientWrapper from "../components/ClientWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "ระบบเวชระเบียนสุขภาพ",
  description: "ระบบเวชระเบียนสุขภาพอิเล็กทรอนิกส์ด้วยบล็อกเชน",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="th">
      <body className="min-h-screen flex flex-col">
        <Navbar /> {/* ✅ ย้ายมาตรงนี้ถูกต้อง */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

'use client'

import { useEffect, useState } from 'react'
import ClientWrapper from './ClientWrapper'
import DarkModeToggle from './DarkModeToggle'

export default function Footer() {
  const [dateString, setDateString] = useState('')
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setDateString(now.toLocaleDateString('th-TH'))
      setTimeString(now.toLocaleTimeString('th-TH'))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="w-full bg-gray-900 text-white text-sm py-4 px-6 ">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2">
        <div>
          <p>Bachelor of Engineering (Computer Engineering and IoT Systems)</p>
          <p>ระบบเวชระเบียนสุขภาพอัจฉริยะ | Smart Health Record</p>
        </div>
        <div className="flex items-center gap-4">
          <span>IP: 127.0.0.1</span>
          <span>{dateString} {timeString}</span>
          <ClientWrapper>
            <DarkModeToggle />
          </ClientWrapper>
        </div>
      </div>
    </footer>
  )
}

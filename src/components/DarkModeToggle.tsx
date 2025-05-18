'use client'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
    setIsDark(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

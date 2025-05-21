'use client'

// นำเข้า useEffect และ useState สำหรับจัดการ state และ lifecycle
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'

// ฟังก์ชันหลักสำหรับหน้าข้อมูลส่วนตัวของผู้ใช้
export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null) // เก็บข้อมูล profile ที่โหลดมา
  const [loading, setLoading] = useState(true) // ใช้แสดงสถานะโหลด
  const [message, setMessage] = useState('') // ข้อความแสดงผลลัพธ์การบันทึก
  const router = useRouter() // สำหรับ redirect หน้า

  // โหลดข้อมูล profile ทันทีเมื่อโหลดหน้า (component did mount)
  useEffect(() => {
    const token = localStorage.getItem('access_token') // ดึง token จาก localStorage
    if (!token) return router.push('/login') // ถ้าไม่มี token ให้กลับไป login

    // เรียก API /me เพื่อดึงข้อมูล profile
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }, // ส่ง token แบบ Bearer
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 ข้อมูลที่ได้จาก /me:", data)
        setProfile(data) // เซ็ตข้อมูลลง state
        setLoading(false)
      })
      .catch(() => router.push('/login')) // ถ้า error ให้ redirect ไปหน้า login
  }, [router])

  // อัปเดตค่าจาก input ลงใน state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev: any) => ({ ...prev, [name]: value }))
  }

  // ส่งข้อมูลไปยัง backend เพื่ออัปเดต profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('access_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    })
    if (res.ok) {
      toast.success('✅ บันทึกข้อมูลแล้ว')
      setMessage('✅ บันทึกข้อมูลแล้ว')
    } else {
      toast.error('❌ บันทึกไม่สำเร็จ')
      setMessage('❌ บันทึกไม่สำเร็จ')
    }
  }

  // แสดงข้อความกำลังโหลด
  if (loading) return <div className="text-center py-10">กำลังโหลด...</div>

  // แสดงหน้า Profile เมื่อโหลดเสร็จแล้ว
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-900 dark:text-blue-300">ข้อมูลส่วนตัว</h1>

        {message && <p className="mb-4 text-green-600 dark:text-green-400 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="first_name_th" placeholder="ชื่อ (ภาษาไทย)" value={profile.first_name_th || ''} onChange={handleChange} className="input" />
          <input name="last_name_th" placeholder="นามสกุล (ภาษาไทย)" value={profile.last_name_th || ''} onChange={handleChange} className="input" />
          <input name="phone" placeholder="เบอร์โทรศัพท์" value={profile.phone || ''} onChange={handleChange} className="input" />
          <input name="house_no" placeholder="บ้านเลขที่" value={profile.house_no || ''} onChange={handleChange} className="input" />
          <input name="sub_district" placeholder="ตำบล" value={profile.sub_district || ''} onChange={handleChange} className="input" />
          <input name="district" placeholder="อำเภอ" value={profile.district || ''} onChange={handleChange} className="input" />
          <input name="province" placeholder="จังหวัด" value={profile.province || ''} onChange={handleChange} className="input" />
          <input name="postal_code" placeholder="รหัสไปรษณีย์" value={profile.postal_code || ''} onChange={handleChange} className="input" />

          <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="px-10 py-2 rounded text-white font-semibold transition bg-blue-600 hover:bg-blue-700">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/*
📦 สรุปการทำงานของ ProfilePage:

- ใช้ useEffect โหลดข้อมูลผู้ใช้จาก API /me โดยแนบ access_token
- ถ้าไม่มี token หรือเกิดข้อผิดพลาด → จะ redirect ไปหน้า login
- เมื่อข้อมูลโหลดเสร็จ จะแสดงฟอร์มพร้อมให้ผู้ใช้แก้ไขข้อมูล
- เมื่อผู้ใช้กดปุ่มบันทึก → ข้อมูลจะถูกส่งไป PATCH เพื่ออัปเดตในฐานข้อมูล
- มีการแจ้งเตือนผลลัพธ์ด้วย toast.success หรือ toast.error
- รองรับ dark mode และมีการจัด layout อย่างสวยงามด้วย Tailwind CSS
*/
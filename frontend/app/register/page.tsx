'use client' // บอก Next.js ว่านี่คือ Client Component (ใช้ useState/useEffect ได้)

import { useState } from 'react' // ใช้จัดการ state
import { useRouter } from 'next/navigation' // ใช้เปลี่ยนหน้าแบบ client-side
import { Toaster, toast } from 'react-hot-toast' // สำหรับแสดง toast แจ้งเตือน

// Component หลัก: หน้าลงทะเบียนผู้ใช้งาน
export default function RegisterPage() {
  const router = useRouter() // ใช้เปลี่ยนเส้นทางเมื่อ register สำเร็จ

  // สร้าง state `form` เพื่อเก็บค่าจาก input ของผู้ใช้
  const [form, setForm] = useState({
    username: "", email: "", confirmEmail: "", password: "", confirmPassword: "",
    id_card: "", phone: "", first_name_th: "", last_name_th: "",
    first_name_en: "", last_name_en: "", birth_date: "",
    house_no: "", sub_district: "", district: "", province: "", postal_code: "",
    blood_type: "", rh_factor: "",
  })

  // สร้าง state `errors` สำหรับเก็บสถานะ error การกรอกข้อมูล
  const [errors, setErrors] = useState({
    passwordMatch: true, // password ตรงกันหรือไม่
    emailMatch: true,    // email ตรงกันหรือไม่
    emailFormat: true,   // email เป็นรูปแบบที่ถูกต้องหรือไม่
  })

  // เมื่อผู้ใช้เปลี่ยน input → update ค่าใน form + ตรวจสอบ error
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value } // อัปเดตฟอร์ม
    setForm(updatedForm)

    // ตรวจสอบเงื่อนไข email/password
    setErrors({
      passwordMatch: updatedForm.password === updatedForm.confirmPassword,
      emailMatch: updatedForm.email === updatedForm.confirmEmail,
      emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedForm.email), // regex ตรวจ email
    })
  }

  // ฟังก์ชันสำหรับ submit ฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // กัน default reload

    // ตรวจสอบว่าข้อมูลฟอร์มถูกต้อง
    if (!errors.passwordMatch || !errors.emailMatch || !errors.emailFormat) {
      toast.error("กรุณากรอกข้อมูลให้ถูกต้อง")
      return
    }

    // สร้าง payload เพื่อส่งให้ backend
    const payload = {
      ...form,
      confirm_email: form.confirmEmail,         // แนบข้อมูล confirm
      confirm_password: form.confirmPassword,
      is_verified: false,                       // default ยังไม่ยืนยันอีเมล
    }

    try {
      // เรียก API /register เพื่อส่งข้อมูลผู้ใช้
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("ลงทะเบียนสำเร็จ กรุณายืนยันอีเมลของคุณ")
        setTimeout(() => router.push('/login'), 3000) // ไปหน้า login หลัง 3 วิ
      } else {
        toast.error(data.detail || "เกิดข้อผิดพลาด") // แสดง error จาก backend
      }
    } catch {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้") // ถ้า fetch error
    }
  }

  // ตรวจสอบว่าฟอร์มครบถ้วนพอที่จะให้กด Submit ได้
  const isValid =
    form.username.trim() !== "" &&
    errors.passwordMatch &&
    errors.emailMatch &&
    errors.emailFormat

  // ส่วนแสดงผลของหน้าจอ
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <Toaster position="top-center" /> {/* ตัวแจ้งเตือน Toast */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-900 dark:text-blue-300">
          ลงทะเบียนผู้ใช้งานระบบเวชระเบียน
        </h1>

        {/* ฟอร์มลงทะเบียน */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* กลุ่ม: Username และ Password */}
          <div className="md:col-span-2 text-blue-700 font-semibold">Users และ Password</div>
          <div className="md:col-span-2">Users</div>
          <input name="username" placeholder="ชื่อผู้ใช้งาน" onChange={handleChange} required className="input" />
          <div className="md:col-span-2">Password</div>
          <input name="password" type="password" placeholder="รหัสผ่าน" onChange={handleChange} required className="input" />
          <input name="confirmPassword" type="password" placeholder="ยืนยันรหัสผ่าน" onChange={handleChange} required className="input" />
          {!errors.passwordMatch && <p className="text-red-500 text-sm md:col-span-2">รหัสผ่านไม่ตรงกัน</p>}

          {/* กลุ่ม: Email */}
          <div className="md:col-span-2 mt-4 text-blue-700 font-semibold">E-mail</div>
          <input name="email" type="email" placeholder="example@gmail.com" onChange={handleChange} required className="input" />
          <input name="confirmEmail" type="email" placeholder="ยืนยันอีเมล" onChange={handleChange} required className="input" />
          {!errors.emailMatch && <p className="text-red-500 text-sm md:col-span-2">อีเมลไม่ตรงกัน</p>}
          {!errors.emailFormat && <p className="text-red-500 text-sm md:col-span-2">อีเมลไม่ถูกต้อง</p>}

          {/* กลุ่ม: ข้อมูลส่วนตัว */}
          <div className="md:col-span-2 mt-4 text-blue-700 font-semibold">ข้อมูลส่วนตัว</div>
          <input name="id_card" placeholder="เลขบัตรประชาชน" onChange={handleChange} maxLength={13} required className="input" />
          <input name="birth_date" type="date" onChange={handleChange} required className="input" />
          <input name="first_name_th" placeholder="ชื่อ (ภาษาไทย)" onChange={handleChange} required className="input" />
          <input name="last_name_th" placeholder="นามสกุล (ภาษาไทย)" onChange={handleChange} required className="input" />
          <input name="first_name_en" placeholder="ชื่อ (ภาษาอังกฤษ)" onChange={handleChange} className="input" />
          <input name="last_name_en" placeholder="นามสกุล (ภาษาอังกฤษ)" onChange={handleChange} className="input" />
          <select name="blood_type" onChange={handleChange} required className="input">
            <option value="">กรุ๊ปเลือด</option>
            <option>A</option><option>B</option><option>AB</option><option>O</option>
          </select>
          <select name="rh_factor" onChange={handleChange} required className="input">
            <option value="">Rh Factor</option>
            <option>+</option><option>-</option>
          </select>

          <input name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleChange} className="input" />

          {/* กลุ่ม: ที่อยู่ */}
          <div className="md:col-span-2 mt-4 text-blue-700 font-semibold">ที่อยู่</div>
          <input name="house_no" placeholder="บ้านเลขที่" onChange={handleChange} required className="input" />
          <input name="sub_district" placeholder="ตำบล" onChange={handleChange} required className="input" />
          <input name="district" placeholder="อำเภอ" onChange={handleChange} required className="input" />
          <input name="province" placeholder="จังหวัด" onChange={handleChange} required className="input" />
          <input name="postal_code" placeholder="รหัสไปรษณีย์" onChange={handleChange} required className="input" />

          {/* ปุ่ม Submit */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`px-10 py-2 rounded text-white font-semibold transition ${
                isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              ลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/*
 สรุปการทำงานของ RegisterPage:
- สร้างฟอร์มด้วย useState และอัปเดตแบบ two-way binding
- ตรวจสอบความถูกต้องของอีเมล (format & match) และรหัสผ่าน
- เมื่อกด "ลงทะเบียน":
   → ถ้า valid → ส่ง POST ไปยัง API `/register`
   → ถ้าสำเร็จ → แจ้งเตือน + พาไปหน้า login หลัง 3 วิ
   → ถ้าล้มเหลว → แสดงข้อความ error ด้วย toast
- ใช้ Tailwind รองรับ dark mode และ responsive layout
*/

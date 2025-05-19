'use client'

import { useState } from 'react'

export default function RegisterPage() {
  // ✅ ประกาศ state form
  const [form, setForm] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    id_card: "",
    phone: "",
    first_name_th: "",
    last_name_th: "",
    first_name_en: "",
    last_name_en: "",
    birth_date: "",
    house_no: "",
    sub_district: "",
    district: "",
    province: "",
    postal_code: "",
    blood_type: "",
    rh_factor: "",
  });

  const [errors, setErrors] = useState({
    passwordMatch: true,
    emailMatch: true,
    emailFormat: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    setErrors({
      passwordMatch: updatedForm.password === updatedForm.confirmPassword,
      emailMatch: updatedForm.email === updatedForm.confirmEmail,
      emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedForm.email),
    });
  };

  // ✅ มีแค่ 1 ฟังก์ชัน handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!errors.passwordMatch || !errors.emailMatch || !errors.emailFormat) {
      alert("❌ กรุณากรอกข้อมูลให้ถูกต้อง");
      return;
    }

    // ✅ Mapping form (camelCase) → payload (snake_case)
    const payload = {
      username: form.username,
      email: form.email,
      confirm_email: form.confirmEmail,
      hashed_password: form.password, 
      confirm_password: form.confirmPassword,
      id_card: form.id_card,
      phone: form.phone,
      first_name_th: form.first_name_th,
      last_name_th: form.last_name_th,
      first_name_en: form.first_name_en,
      last_name_en: form.last_name_en,
      birth_date: form.birth_date,
      house_no: form.house_no,
      sub_district: form.sub_district,
      district: form.district,
      province: form.province,
      postal_code: form.postal_code,
      blood_type: form.blood_type,
      rh_factor: form.rh_factor,
      is_verified: false, 
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ ลงทะเบียนสำเร็จ กรุณายืนยันอีเมลของคุณ");
      } else {
        if (typeof data.detail === "object") {
          alert(`❌ ${JSON.stringify(data.detail)}`);
        } else {
          alert(`❌ ${data.detail || "เกิดข้อผิดพลาด"}`);
        }
      }
    } catch (error) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const isValid =
    form.username.trim() !== "" &&
    errors.passwordMatch &&
    errors.emailMatch &&
    errors.emailFormat;

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-white dark:text-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
          ลงทะเบียนผู้ใช้งานระบบเวชระเบียน
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input name="username" required onChange={handleChange}
              className="p-2 border rounded w-full" placeholder="ชื่อผู้ใช้งาน" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required onChange={handleChange}
              className="p-2 border rounded w-full" placeholder="example@gmail.com" />
            {!errors.emailFormat && <p className="text-red-500 text-sm">อีเมลไม่ถูกต้อง</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ยืนยัน Email</label>
            <input name="confirmEmail" type="email" required onChange={handleChange}
              className="p-2 border rounded w-full" placeholder="ยืนยันอีเมล" />
            {!errors.emailMatch && <p className="text-red-500 text-sm">อีเมลไม่ตรงกัน</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
            <input
              name="phone"
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" type="password" required onChange={handleChange}
              className="p-2 border rounded w-full" placeholder="รหัสผ่าน" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ยืนยัน Password</label>
            <input name="confirmPassword" type="password" required onChange={handleChange}
              className="p-2 border rounded w-full" placeholder="ยืนยันรหัสผ่าน" />
            {!errors.passwordMatch && <p className="text-red-500 text-sm">รหัสผ่านไม่ตรงกัน</p>}
          </div>

          {/* ID + วันเกิด */}
          <input name="id_card" placeholder="เลขบัตรประชาชน" required onChange={handleChange}
            maxLength={13} className="p-2 border rounded w-full" />
          <input name="birth_date" type="date" required onChange={handleChange}
            className="p-2 border rounded w-full" />

          {/* ชื่อ */}
          <input name="first_name_th" placeholder="ชื่อ (ภาษาไทย)" required onChange={handleChange}
            className="p-2 border rounded w-full" />
          <input name="last_name_th" placeholder="นามสกุล (ภาษาไทย)" required onChange={handleChange}
            className="p-2 border rounded w-full" />

          <input name="first_name_en" placeholder="ชื่อ (ภาษาอังกฤษ)" onChange={handleChange}
            className="p-2 border rounded w-full" />
          <input name="last_name_en" placeholder="นามสกุล (ภาษาอังกฤษ)" onChange={handleChange}
            className="p-2 border rounded w-full" />

          {/* ที่อยู่ */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">ที่อยู่</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="house_no" placeholder="บ้านเลขที่" required onChange={handleChange}
                className="p-2 border rounded w-full" />
              <input name="sub_district" placeholder="ตำบล" required onChange={handleChange}
                className="p-2 border rounded w-full" />
              <input name="district" placeholder="อำเภอ" required onChange={handleChange}
                className="p-2 border rounded w-full" />
              <input name="province" placeholder="จังหวัด" required onChange={handleChange}
                className="p-2 border rounded w-full" />
              <input name="postal_code" placeholder="รหัสไปรษณีย์" required onChange={handleChange}
                className="p-2 border rounded w-full" />
            </div>
          </div>

          {/* เลือด */}
          <select name="blood_type" required onChange={handleChange}
            className="p-2 border rounded w-full">
            <option value="">กรุ๊ปเลือด</option>
            <option>A</option><option>B</option><option>AB</option><option>O</option>
          </select>
          <select name="rh_factor" required onChange={handleChange}
            className="p-2 border rounded w-full">
            <option value="">Rh Factor</option>
            <option>+</option><option>-</option>
          </select>

          {/* ปุ่มลงทะเบียน */}
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
  );
}
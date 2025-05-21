export async function login(email: string, password: string) {
  // ประกาศฟังก์ชัน login แบบ async รับ email และ password เป็น string

  const formData = new FormData()
  // สร้างอ็อบเจกต์ FormData สำหรับเก็บข้อมูลที่จะส่งไปกับ request

  formData.append("email", email)
  // เพิ่มข้อมูล email ลงใน formData โดยใช้ key "email" และ value จากตัวแปร email

  formData.append("password", password)
  // เพิ่มข้อมูล password ลงใน formData โดยใช้ key "password" และ value จากตัวแปร password

  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    body: formData,
    // ส่ง HTTP POST request ไปที่ http://localhost:8000/login
    // ใส่ formData เป็น body ของ request
    // ไม่ต้องกำหนด 'Content-Type' เอง เพราะ browser จะจัดการให้เมื่อใช้ FormData
  })

  const data = await res.json()
  // แปลง response ที่ได้จาก server เป็น JSON แล้วเก็บในตัวแปร data

  if (res.ok) {
    // ถ้า response status อยู่ในช่วง 200-299 (สำเร็จ)
    localStorage.setItem("access_token", data.access_token)
    // เก็บ access_token ที่ได้จาก server ลงใน localStorage ของ browser
    return data
    // คืนค่า data (ข้อมูลที่ได้จาก server) ออกไป
  } else {
    // ถ้า response ไม่สำเร็จ (เช่น status 400, 401, 500 ฯลฯ)
    throw new Error(data.detail || "เข้าสู่ระบบล้มเหลว")
    // ขว้าง error โดยใช้ข้อความจาก data.detail หรือ "เข้าสู่ระบบล้มเหลว" ถ้าไม่มี detail
  }
}

//
// ---------------------------------------------------------------
// สรุปการทำงานของฟังก์ชันนี้:
// 1. รับ email และ password จากผู้ใช้
// 2. สร้าง FormData แล้วใส่ email กับ password ลงไป
// 3. ส่ง POST request ไปยัง endpoint /login ของ backend (http://localhost:8000/login)
// 4. backend จะตรวจสอบข้อมูลและส่ง response กลับมา (เช่น access_token)
// 5. ถ้า login สำเร็จ จะเก็บ access_token ลงใน localStorage เพื่อใช้ยืนยันตัวตนในครั้งถัดไป
// 6. คืนค่าข้อมูลที่ได้จาก backend ออกไป
// 7. ถ้า login ไม่สำเร็จ จะขว้าง error พร้อมข้อความที่เหมาะสม
// ตัวแปรที่รับเข้า: email, password
// ตัวแปรที่ส่งออก: data (ข้อมูลจาก backend) หรือ error
// ตัวแปร access_token จะถูกเก็บไว้ใน localStorage ฝั่ง client
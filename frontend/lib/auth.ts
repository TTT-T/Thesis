export async function login(email: string, password: string) {
  const formData = new FormData()
  formData.append("email", email)
  formData.append("password", password)

  const res = await fetch("http://localhost:8000/login", {
    method: "POST",
    body: formData,
    // ✅ ห้ามใส่ 'Content-Type' ด้วยมือ ถ้าใช้ FormData (Browser จะใส่ให้เอง)
  })

  const data = await res.json()
  if (res.ok) {
    localStorage.setItem("access_token", data.access_token)
    return data
  } else {
    throw new Error(data.detail || "เข้าสู่ระบบล้มเหลว")
  }
}

#  โหลด .env ขึ้นมาใช้งาน (ใช้สำหรับเก็บ key ต่าง ๆ อย่างปลอดภัย)
from dotenv import load_dotenv
load_dotenv()

#  import module ที่ใช้
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#  ฟังก์ชันสำหรับสร้างตารางในฐานข้อมูล (เชื่อมกับ SQLAlchemy)
from backend.database import create_tables

#  import router ของแต่ละฟีเจอร์
from backend.router import auth, register, admin, dashboard




# ====== ค่าคงที่สำหรับ JWT ======
#  อ่าน SECRET_KEY และ ALGORITHM จาก .env (ถ้าไม่มีจะใช้ค่าดีฟอลต์)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeyforjwt123456789")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

#  สร้าง instance หลักของ FastAPI (ตัวแอปหลัก)
app = FastAPI()



# ====== CORS Middleware ======
#  กำหนด origin ที่อนุญาตให้เชื่อมต่อกับ API ได้ (เช่น frontend)
origins = [
    "http://localhost:3000",     # สำหรับ frontend ที่รัน local
    "http://127.0.0.1:3000",     # อีกวิธีการเข้าถึงแบบ local
]

#  เปิดใช้งาน CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            #  อนุญาตเฉพาะ origin ที่กำหนด
    allow_credentials=True,           #  อนุญาตการส่ง cookie/headers พิเศษ
    allow_methods=["*"],              #  อนุญาตทุก method (GET, POST, PUT, DELETE)
    allow_headers=["*"],              #  อนุญาตทุก headers
)

# ====== รวม Router (route สำหรับ API แต่ละหมวด) ======
#  เพิ่ม router ที่แยกเป็นโมดูลเพื่อให้โค้ดจัดการง่ายขึ้น
app.include_router(auth.router)       # login/logout, token, verify
app.include_router(register.router)   # register และ validate ข้อมูลผู้ใช้
app.include_router(admin.router)      # route สำหรับ admin เช่น แสดงผู้ใช้ทั้งหมด
app.include_router(dashboard.router)  # route หลัง login เช่น welcome, role

# ====== Event ตอน startup ======
#  ฟังก์ชันนี้จะทำงานตอน FastAPI เริ่มทำงาน
@app.on_event("startup")
def startup():
    create_tables()  #  สร้างตารางอัตโนมัติถ้ายังไม่มี (จาก SQLAlchemy models)
    #  สามารถเพิ่มฟังก์ชันอื่น ๆ ที่ต้องการให้ทำงานตอน startup ได้ที่นี่
    # เช่น การเชื่อมต่อฐานข้อมูล, การโหลดข้อมูลเริ่มต้น, etc.


"""
main.py เป็นไฟล์เริ่มต้นของ backend FastAPI ในโปรเจกต์ระบบเวชระเบียนสุขภาพ

สิ่งที่ทำ:
1. โหลดค่า environment จาก .env (เช่น SECRET_KEY สำหรับ JWT)
2. สร้างแอป FastAPI
3. เปิดใช้งาน CORS เพื่อให้ frontend (localhost:3000) เรียก API ได้
4. นำ router ย่อยจาก auth, register, admin, dashboard มารวมกัน
5. เมื่อแอปเริ่มทำงาน (startup) → สร้างตารางในฐานข้อมูลโดยอัตโนมัติผ่าน SQLAlchemy

ข้อดีของโครงสร้างนี้:
- แยก router ตามหมวด ทำให้โค้ดอ่านง่าย
- รองรับ frontend-React/Next.js ได้ทันที
- พร้อมสำหรับระบบ login/register และ role-based access control
"""

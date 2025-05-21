#  โหลดตัวแปรจากไฟล์ .env (.env เก็บค่าความลับ เช่น SECRET_KEY, EMAIL)
from dotenv import load_dotenv
import os

#  ใช้สำหรับจัดการเวลาใน JWT (วันหมดอายุ)
from datetime import datetime, timedelta

#  ใช้ jose สำหรับเข้ารหัสและถอดรหัส JWT
from jose import jwt

#  โหลดตัวแปรจากไฟล์ .env เข้าสู่ environment variable
load_dotenv()

#  ดึงค่าความลับจาก environment หรือใช้ค่า default ถ้าไม่เจอ
SECRET_KEY = os.getenv("SECRET_KEY") or "supersecretkeyforjwt123456789"
# ใช้ในการเข้ารหัสและถอดรหัส token

ALGORITHM = os.getenv("ALGORITHM") or "HS256"
# ระบุอัลกอริทึมที่ใช้ในการเข้ารหัส JWT

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 30)
# เวลาหมดอายุของ access token (หน่วย: นาที)

#  ฟังก์ชันสำหรับสร้าง JWT token
def create_jwt(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()  # copy ข้อมูลเพื่อใส่ใน token
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # คำนวณวันหมดอายุ (ใช้ค่าที่ส่งมา หรือค่า default)
    to_encode.update({"exp": expire})  # เพิ่ม field "exp" ลงใน token payload
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # เข้ารหัส payload ด้วย SECRET_KEY และ ALGORITHM
    return encoded_jwt  # คืน token ที่เข้ารหัสแล้ว

#  ฟังก์ชันสำหรับตรวจสอบ token ว่า valid ไหม
def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # ถอดรหัส token ด้วยคีย์และอัลกอริทึมเดียวกัน
        return payload  # คืนข้อมูลภายใน token ถ้า valid
    except Exception as e:
        print("JWT decode error:", e)  # แสดงข้อผิดพลาด
        return None  # ถ้า decode ไม่ได้ (token ผิดหรือหมดอายุ)

#  ฟังก์ชันอีกตัวสำหรับ decode token (ใช้ชื่อชัดกว่า verify)
def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        # ถ้า JWT มีปัญหา (เช่นหมดอายุ โครงสร้างผิด ฯลฯ)
        return None
        # คืนค่า None ถ้า decode ไม่สำเร็จ
#  ฟังก์ชันนี้จะใช้ใน route ที่ต้องการตรวจสอบ token

"""
🔐 โค้ดนี้ทำหน้าที่เกี่ยวกับการสร้างและตรวจสอบ JWT (JSON Web Token)
ใช้ในระบบยืนยันตัวตน (Authentication) กับ FastAPI หรือ API อื่น ๆ

1. create_jwt(data, expires_delta)
    สร้าง JWT จากข้อมูลผู้ใช้ เช่น {"sub": "user_id"} พร้อมกำหนดวันหมดอายุ

2. verify_jwt(token)
    ถอดรหัส token และคืน payload ถ้า valid, คืน None ถ้า invalid

3. decode_jwt(token)
    ฟังก์ชันเหมือน verify_jwt แต่ชื่อชัดเจน ใช้สำหรับ dependency หรือ API ที่ต้อง decode

4. ค่าคงที่ทั้งหมดโหลดจาก `.env` ได้แก่:
   - SECRET_KEY → ใช้เซ็นและตรวจสอบ JWT
   - ALGORITHM → ใช้ระบุอัลกอริทึม (HS256)
   - ACCESS_TOKEN_EXPIRE_MINUTES → ระบุเวลา token มีอายุ

 จุดเด่น:
- รองรับ .env
- ใช้ `jose` ซึ่งปลอดภัย
- พร้อมใช้ในระบบ login/token-based auth

 ใช้ร่วมกับ FastAPI endpoint ที่ต้องการป้องกันสิทธิ์การเข้าถึงได้ทันที
"""

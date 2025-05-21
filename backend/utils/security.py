#  โหลดค่าจากไฟล์ .env เช่น SECRET_KEY, ALGORITHM
from dotenv import load_dotenv
import os

#  สำหรับจัดการเวลาหมดอายุของ JWT
from datetime import datetime, timedelta

#  ใช้ jose ในการเข้ารหัส/ถอดรหัส JWT
from jose import jwt

#  ฟังก์ชันที่ใช้ใน FastAPI
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

#  import ฟังก์ชัน decode_jwt จากไฟล์เดียวกันหรือไฟล์แยก
from .jwt import decode_jwt  # ถ้าอยู่รวมกันให้ใช้: from .security import decode_jwt

#  โหลดค่าจาก .env (ต้องเรียกก่อนใช้ os.getenv)
load_dotenv()

#  สำหรับแฮชรหัสผ่าน (ใช้ bcrypt เพราะปลอดภัย)
import bcrypt

# ====== แฮชรหัสผ่านด้วย bcrypt ======
def hash_password(password: str) -> str:
    #  สร้าง salt แบบสุ่ม
    salt = bcrypt.gensalt()
    #  แฮชรหัสผ่านโดยใช้ salt ที่สร้างไว้
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    #  แปลงจาก bytes → string เพื่อเก็บในฐานข้อมูล
    return hashed.decode('utf-8')

# ====== โหลดค่าจาก .env ======
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing from .env or not loaded correctly")
    #  หากไม่พบ SECRET_KEY → หยุดทำงานทันที (ปลอดภัยกว่า)

ALGORITHM = os.getenv("ALGORITHM", "HS256")
#  ใช้ HS256 เป็นอัลกอริทึม default ถ้าไม่ได้ตั้งไว้

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
#  ตั้งค่าเวลา access token หมดอายุ ถ้าไม่มีให้ใช้ 30 นาที

# ====== ฟังก์ชันสำหรับสร้าง JWT Token ======
def create_jwt(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()  #  copy ข้อมูลที่ต้องการใส่ใน token
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    #  ถ้ามีเวลาหมดอายุให้ใช้ หรือใช้ default
    to_encode.update({"exp": expire})  #  ใส่เวลาหมดอายุใน payload
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  #  เข้ารหัส JWT

# ====== ตรวจสอบและถอดรหัส JWT (แบบเบื้องต้น) ======
def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  #  ถ้า decode สำเร็จ ส่ง payload กลับ
    except Exception as e:
        print("JWT decode error:", e)
        return None  # ❌ ถ้า decode ล้มเหลว (เช่น token หมดอายุ)

# ====== ถอดรหัส JWT โดยเน้นใช้งานใน Dependency ======
def decode_jwt(token: str):
    """
    Decode JWT token. Return payload if valid, otherwise None.
    """
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token
    except Exception as e:
        print("decode_jwt error:", e)
        return None

# ====== ใช้ใน FastAPI เพื่อดึง token จาก header Authorization: Bearer <token> ======
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
#  FastAPI จะดึง token จาก header อัตโนมัติ แล้วส่งให้เราใช้ต่อได้ผ่าน Depends

# ====== Dependency สำหรับดึงผู้ใช้จาก token ======
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token ไม่ถูกต้องหรือหมดอายุ")
    return payload  #  คืนข้อมูล payload (อาจจะมี user_id หรือ email อยู่ในนี้)

"""
🔥 โค้ดนี้คือระบบจัดการ JWT Authentication ใน FastAPI ซึ่งประกอบด้วย:

1. hash_password(password)
   - ใช้ bcrypt แฮชรหัสผ่านก่อนเก็บลงฐานข้อมูล

2. create_jwt(data, expires_delta)
   - สร้าง JWT token ที่ใส่ข้อมูล + เวลา expired

3. decode_jwt(token) / verify_jwt(token)
   - ถอดรหัส JWT token และคืน payload (หรือ None ถ้าไม่ valid)

4. get_current_user(token)
   - ใช้กับ Depends เพื่อดึงข้อมูลผู้ใช้จาก token โดยอัตโนมัติ
   - ถ้า token ผิดหรือหมดอายุ → คืน 401 Unauthorized

5. oauth2_scheme
   - ดึง token จาก HTTP Header `Authorization: Bearer <token>`

 ใช้ร่วมกับระบบ login / auth เช่น:
   - ผู้ใช้ login → รับ token → นำ token แนบมากับ request ถัดไป
   - API endpoint ใช้ Depends(get_current_user) → เช็กว่าใครเรียกมา

 ใช้ .env เพื่อเก็บค่า SECRET_KEY, ALGORITHM, และ EMAIL อย่างปลอดภัย
 โค้ดนี้พร้อมใช้ในโปรเจกต์จริง
"""
#  หมายเหตุ: ควรมีการทดสอบและตรวจสอบความปลอดภัยเพิ่มเติม
#  หมายเหตุ: ควรมีการจัดการข้อผิดพลาดและ log ที่เหมาะสมใน production

#  นำเข้า router และ dependency ต่าง ๆ จาก FastAPI
from fastapi import APIRouter, Depends, HTTPException

#  นำเข้า Session สำหรับติดต่อกับฐานข้อมูล
from sqlalchemy.orm import Session

#  นำเข้า function ที่ใช้เชื่อมต่อกับฐานข้อมูล
from backend.database import get_db

#  นำเข้า model User ที่ map กับตารางผู้ใช้ในฐานข้อมูล
from backend.models.user_model import User

#  นำเข้า schema ที่ใช้รับข้อมูลจาก client (เช่น form register)
from backend.schemas.user import RegisterUser

#  ใช้สำหรับแฮชรหัสผ่านก่อนเก็บ
from backend.utils.security import hash_password

#  ฟังก์ชันสำหรับส่งอีเมลยืนยัน
from backend.utils.email import send_verification_email

#  ฟังก์ชันสำหรับสร้าง JWT token
from backend.utils.jwt import create_jwt

#  สำหรับบันทึกเวลาที่ผู้ใช้สมัคร
from datetime import datetime

#  สร้าง router สำหรับกลุ่มเส้นทาง "/register"
router = APIRouter()

#  endpoint ลงทะเบียนผู้ใช้ใหม่
@router.post("/register")
async def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    #  ตรวจสอบว่า username ซ้ำในระบบหรือไม่
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username ซ้ำ")
    
    #  ตรวจสอบว่า email ซ้ำหรือไม่
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email ซ้ำ")

    #  ตรวจสอบว่าเลขบัตรประชาชนซ้ำหรือไม่
    if db.query(User).filter(User.id_card == user.id_card).first():
        raise HTTPException(status_code=400, detail="เลขบัตรประชาชนซ้ำ")

    #  สร้าง user ใหม่ (ใส่ค่าจากฟอร์มลงใน model)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),  #  แฮชรหัสผ่านก่อนเก็บ
        id_card=user.id_card,
        phone=user.phone,
        first_name_th=user.first_name_th,
        last_name_th=user.last_name_th,
        first_name_en=user.first_name_en,
        last_name_en=user.last_name_en,
        birth_date=user.birth_date,
        house_no=user.house_no,
        sub_district=user.sub_district,
        district=user.district,
        province=user.province,
        postal_code=user.postal_code,
        blood_type=user.blood_type,
        rh_factor=user.rh_factor,
        created_at=datetime.now(),  #  บันทึกวันที่สมัคร
    )

    #  เพิ่ม user ใหม่ลงใน session และ commit เข้าฐานข้อมูล
    db.add(new_user)
    db.commit()

    #  สร้าง JWT token สำหรับยืนยันอีเมล โดยใช้ email เป็น payload (sub)
    token = create_jwt({"sub": user.email})

    #  ส่งอีเมลยืนยัน (เป็น async function)
    await send_verification_email(user.email, token)

    #  ส่ง response กลับไปยัง client
    return {"message": " ลงทะเบียนสำเร็จ กรุณายืนยันอีเมล"}


"""
 endpoint นี้คือระบบ 'สมัครสมาชิก' สำหรับระบบเวชระเบียน ที่มีการ 'ยืนยันอีเมล' ด้วย JWT

 ขั้นตอนหลัก:
1. รับข้อมูลผู้ใช้จาก frontend → ตรวจสอบว่า username, email, id_card ซ้ำหรือไม่
2. แฮชรหัสผ่าน → สร้าง User object จากข้อมูล → บันทึกลงฐานข้อมูล
3. สร้าง JWT token (payload = email) → ส่งไปทางอีเมล
4. ผู้ใช้จะได้รับอีเมลพร้อมลิงก์ เช่น:
   http://localhost:3000/verify-email?token=eyJhbGciOi...
5. เมื่อกดลิงก์ → ระบบ backend จะตรวจสอบ token และอัปเดตสถานะเป็น `is_verified=True`

 ใช้ร่วมกับ:
- schema: `RegisterUser` (มีการตรวจสอบ password/email)
- JWT: ใช้ `create_jwt({"sub": email})` พร้อมเวลาหมดอายุ
- Email: ใช้ SMTP ผ่าน `send_verification_email`

 ปลอดภัย:
- password ถูกแฮช
- token มีวันหมดอายุ
- ระบบป้องกันข้อมูลซ้ำ

 ต่อไป: ใช้ endpoint `/verify-email?token=...` เพื่อยืนยันอีเมล → อัปเดต `is_verified`
"""


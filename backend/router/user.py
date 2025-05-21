#  นำเข้า module ที่จำเป็นจาก FastAPI
from fastapi import APIRouter, HTTPException, Depends

#  ใช้สำหรับจัดการ session กับฐานข้อมูลผ่าน SQLAlchemy
from sqlalchemy.orm import Session

#  นำเข้า schema ที่ใช้รับข้อมูลจากผู้ใช้ตอนลงทะเบียน
from backend.schemas.user import RegisterUser

#  นำเข้า model ของผู้ใช้ที่ใช้ map กับฐานข้อมูล
from backend.models.user_model import User

#  ฟังก์ชันเชื่อมต่อฐานข้อมูล
from backend.database import get_db

#  ฟังก์ชันสำหรับแฮชรหัสผ่านก่อนเก็บในฐานข้อมูล
from backend.utils.security import hash_password

#  ใช้สำหรับบันทึกเวลาสร้างข้อมูล
import datetime

#  สร้าง router สำหรับจัดกลุ่ม endpoint
router = APIRouter()

#  สร้าง endpoint POST /register สำหรับลงทะเบียนผู้ใช้งาน
@router.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    #  ตรวจสอบว่า username ซ้ำหรือไม่
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username มีอยู่แล้ว")

    #  ตรวจสอบว่า email ซ้ำหรือไม่
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email ซ้ำ")

    #  สร้าง object ของผู้ใช้ใหม่จากข้อมูลที่รับเข้ามา
    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),  #  แฮชรหัสผ่านก่อนเก็บ
        id_card=user.id_card,
        birth_date=user.birth_date,
        first_name_th=user.first_name_th,
        last_name_th=user.last_name_th,
        first_name_en=user.first_name_en,
        last_name_en=user.last_name_en,
        phone=user.phone,
        house_no=user.house_no,
        sub_district=user.sub_district,
        district=user.district,
        province=user.province,
        postal_code=user.postal_code,
        blood_type=user.blood_type,
        rh_factor=user.rh_factor,
        created_at=datetime.datetime.now()  #  กำหนดเวลาสร้าง
    )

    #  เพิ่มผู้ใช้ใหม่ลงใน database session
    db.add(new_user)
    db.commit()        #  บันทึกข้อมูลจริงลงในฐานข้อมูล
    db.refresh(new_user)  #  รีเฟรชให้ new_user มีค่า ID ที่สร้างโดยฐานข้อมูล

    #  ส่งข้อความตอบกลับไปยัง client
    return {"message": "ลงทะเบียนสำเร็จ"}


"""
 ฟังก์ชันนี้คือ endpoint สำหรับลงทะเบียนผู้ใช้ใหม่ในระบบเวชระเบียน

 กระบวนการ:
1. รับข้อมูลผู้ใช้จาก frontend (ผ่าน schema `RegisterUser`)
2. ตรวจสอบว่ามี username หรือ email ซ้ำหรือไม่ → ถ้ามี ส่ง error 400
3. สร้าง user ใหม่โดย:
   - แฮชรหัสผ่านก่อนเก็บ (ปลอดภัย)
   - เก็บข้อมูลส่วนตัว เช่น ชื่อ, ที่อยู่, เลือด, วันเกิด
4. บันทึกข้อมูลลงฐานข้อมูลด้วย SQLAlchemy
5. ส่งข้อความตอบกลับ “ลงทะเบียนสำเร็จ”

 จุดเด่น:
- ป้องกันข้อมูลซ้ำ
- รหัสผ่านปลอดภัยด้วย bcrypt
- โค้ดรองรับต่อยอดเพิ่มระบบยืนยันอีเมลได้ง่าย

 แนะนำให้ต่อยอด:
- เพิ่ม `is_verified=False` และส่งอีเมลยืนยันหลังลงทะเบียน
- ใช้ `background_tasks.add_task(send_verification_email, user.email, token)`
"""

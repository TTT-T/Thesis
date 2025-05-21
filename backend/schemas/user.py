#  import base model สำหรับ schema
from pydantic import BaseModel, EmailStr, constr, validator

#  import type hinting เพิ่มเติม
from typing import Annotated, Literal

#  สำหรับจัดการข้อมูลวันเกิด และวันเวลาที่สร้าง
from datetime import date, datetime

# ====== SCHEMA: รับข้อมูลจากฟอร์มลงทะเบียน ======
class RegisterUser(BaseModel):
    #  username ต้องมีความยาวอย่างน้อย 4 ตัว
    username: Annotated[str, constr(min_length=4)]

    #  email ต้องเป็นอีเมลที่ถูกต้องตามฟอร์แมต
    email: EmailStr
    confirm_email: EmailStr  # ยืนยัน email

    #  password ต้องมีอย่างน้อย 8 ตัว
    password: Annotated[str, constr(min_length=8)]
    confirm_password: str  # ยืนยัน password

    #  บัตรประชาชน 13 หลักเป๊ะ
    id_card: Annotated[str, constr(min_length=13, max_length=13)]

    #  เบอร์โทรเป็น optional (ใส่หรือไม่ใส่ก็ได้)
    phone: str | None = None

    #  ชื่อ-นามสกุลภาษาไทย
    first_name_th: str
    last_name_th: str

    #  ชื่อ-นามสกุลภาษาอังกฤษ (optional)
    first_name_en: str | None = None
    last_name_en: str | None = None

    #  วันเกิด
    birth_date: date

    #  ที่อยู่
    house_no: str
    sub_district: str
    district: str
    province: str
    postal_code: str

    #  เลือด
    blood_type: str
    rh_factor: str

    #  บทบาทของผู้ใช้ มีได้เฉพาะ "admin" หรือ "user" เท่านั้น (default = "user")
    role: Literal["admin", "user"] = "user"

    # ====== VALIDATORS ======

    #  ตรวจสอบว่า password กับ confirm_password ตรงกัน
    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("รหัสผ่านไม่ตรงกัน")
        return v

    #  ตรวจสอบว่า email กับ confirm_email ตรงกัน
    @validator("confirm_email")
    def emails_match(cls, v, values):
        if "email" in values and v != values["email"]:
            raise ValueError("อีเมลไม่ตรงกัน")
        return v

# ====== SCHEMA: สำหรับแสดงข้อมูลผู้ใช้ต่อสาธารณะ (ไม่รวมข้อมูลสำคัญ) ======
class UserOutPublic(BaseModel):
    id: int
    username: str
    email: EmailStr
    first_name_th: str
    last_name_th: str
    birth_date: date
    blood_type: str
    rh_factor: str

    #  อนุญาตให้สร้าง instance จาก ORM model เช่น SQLAlchemy
    model_config = {
        "from_attributes": True
    }

# ====== SCHEMA: สำหรับแสดงข้อมูลผู้ใช้ในฝั่ง Admin (ข้อมูลละเอียดครบถ้วน) ======
class UserOutAdmin(BaseModel):
    id: int
    username: str
    email: EmailStr
    id_card: str
    phone: str | None = None
    first_name_th: str
    last_name_th: str
    first_name_en: str | None = None
    last_name_en: str | None = None
    birth_date: date
    house_no: str
    sub_district: str
    district: str
    province: str
    postal_code: str
    blood_type: str
    rh_factor: str
    is_verified: bool  #  ยืนยันอีเมลแล้วหรือยัง
    created_at: datetime  #  วันที่สร้างบัญชี

    model_config = {
        "from_attributes": True
    }



"""
 โค้ดนี้คือชุด Schema สำหรับ FastAPI ที่ใช้จัดการข้อมูลผู้ใช้

 1. RegisterUser:
   - ใช้รับข้อมูลการลงทะเบียนจากผู้ใช้
   - มีการ validate ว่า email/password ต้องตรงกับ confirm
   - รองรับชื่อไทย/อังกฤษ เบอร์โทร วันเกิด ที่อยู่ กรุ๊ปเลือด ฯลฯ
   - รองรับ role (user/admin) อย่างชัดเจนด้วย Literal

 2. UserOutPublic:
   - ใช้สำหรับส่งข้อมูลผู้ใช้แบบปลอดภัย (ไม่รวม id_card, password ฯลฯ)
   - เหมาะสำหรับแสดงข้อมูลทั่วไปต่อ frontend/public

 3. UserOutAdmin:
   - ใช้เฉพาะฝั่งแอดมิน เพื่อดูข้อมูลผู้ใช้แบบละเอียด
   - มีทั้ง id_card, เบอร์โทร, ที่อยู่, วันที่สมัคร และสถานะยืนยันบัญชี

 ทุก schema รองรับการทำงานร่วมกับ SQLAlchemy ด้วย `from_attributes=True`
 ออกแบบตามหลัก Clean Architecture → แยก schema ใช้ตามบริบท (Public vs Admin vs Input)

"""

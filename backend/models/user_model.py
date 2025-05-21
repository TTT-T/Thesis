# import type ต่าง ๆ ที่ใช้สำหรับกำหนด column
from sqlalchemy import Column, String, Integer, Date, TIMESTAMP, Boolean

# import Base class จากโมดูล database (เป็นตัวแม่ของ SQLAlchemy models)
from backend.database import Base

# กำหนด model ที่ map กับตาราง "users" ในฐานข้อมูล
class User(Base):
    __tablename__ = "users"  # ชื่อตารางในฐานข้อมูล

    # คอลัมน์ ID (primary key, index เพื่อ query เร็ว)
    id = Column(Integer, primary_key=True, index=True)

    # ชื่อผู้ใช้ ต้องไม่ซ้ำ (ใช้ในการ login หรือระบุผู้ใช้)
    username = Column(String, unique=True, nullable=False)

    # อีเมลของผู้ใช้ (ใช้ login + ยืนยันตัวตน) ต้องไม่ซ้ำ
    email = Column(String, unique=True, nullable=False)

    # รหัสผ่านที่ถูกแฮชแล้ว (ไม่ควรเก็บ plain password)
    hashed_password = Column(String, nullable=False)

    # สถานะการยืนยันอีเมล (False เมื่อสมัครใหม่, True หลังคลิกลิงก์ยืนยัน)
    is_verified = Column(Boolean, default=False)

    # หมายเลขบัตรประชาชน 13 หลัก (ต้องไม่ซ้ำ)
    id_card = Column(String(13), unique=True, nullable=False)

    # วันเกิด (ใช้สำหรับยืนยันตัวตนหรือข้อมูลสุขภาพ)
    birth_date = Column(Date, nullable=False)

    # ชื่อจริง-นามสกุล ภาษาไทย
    first_name_th = Column(String)
    last_name_th = Column(String)

    # ชื่อจริง-นามสกุล ภาษาอังกฤษ (optional)
    first_name_en = Column(String)
    last_name_en = Column(String)

    # เบอร์โทรศัพท์ (optional)
    phone = Column(String)

    # ที่อยู่
    house_no = Column(String)
    sub_district = Column(String)
    district = Column(String)
    province = Column(String)
    postal_code = Column(String)

    # ข้อมูลสุขภาพ: กรุ๊ปเลือด และ Rh factor
    blood_type = Column(String)
    rh_factor = Column(String)

    # วันที่สร้างบัญชี (timestamp)
    created_at = Column(TIMESTAMP)

    # บทบาทของผู้ใช้ เช่น admin, user, superadmin
    role = Column(String, default="user")
    


"""
SQLAlchemy Model: User
ใช้สำหรับสร้าง/อ่าน/เขียนข้อมูลจากตาราง `users`

ฟิลด์สำคัญ:
- username, email, id_card → ต้องไม่ซ้ำ (มี unique=True)
- hashed_password → ใช้เก็บรหัสผ่านที่แฮชแล้ว
- is_verified → ใช้ร่วมกับระบบยืนยันอีเมล
- role → รองรับ Role-Based Access Control (RBAC)
- created_at → วันที่สร้างบัญชี
- birth_date, blood_type, rh_factor → ข้อมูลด้านสุขภาพ
- first/last name ทั้งไทย/อังกฤษ → รองรับเอกสารทั้งในและต่างประเทศ

ใช้ร่วมกับ:
- Pydantic schema เช่น RegisterUser, UserOutAdmin
- ระบบ login, dashboard, ยืนยันตัวตน, auth token
 Model นี้พร้อมใช้งานกับ SQLAlchemy ORM และรองรับระบบสุขภาพอิเล็กทรอนิกส์อย่างครบถ้วน
 
"""

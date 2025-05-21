# import สำหรับสร้าง engine และ session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#ใช้โหลดค่า environment เช่น DATABASE_URL จาก .env
from dotenv import load_dotenv
import os

# โหลดตัวแปรจาก .env (เช่น DATABASE_URL)
load_dotenv()

# ดึง DATABASE_URL จาก environment เช่น:
# postgresql://postgres:12345@localhost:5432/postgres
DATABASE_URL = os.getenv("DATABASE_URL")

# สร้าง engine ที่ใช้ติดต่อกับ PostgreSQL
engine = create_engine(DATABASE_URL)

# สร้าง SessionLocal (session สำหรับใช้งานในแต่ละ request)
SessionLocal = sessionmaker(
    autocommit=False,  # ไม่ commit ให้อัตโนมัติ
    autoflush=False,   # ไม่ flush session อัตโนมัติ
    bind=engine        # ผูกกับ engine ที่สร้างไว้
)

# ฐานข้อมูลทั้งหมดจะอ้างอิงจาก class นี้ (เป็น root ของ model ทั้งหมด)
Base = declarative_base()

# ฟังก์ชันที่ใช้ใน Depends สำหรับเชื่อม session กับ FastAPI
def get_db():
    db = SessionLocal()  # สร้าง session ใหม่
    try:
        yield db         # คืน session ไปให้ endpoint ใช้งาน
    finally:
        db.close()       # ปิด session หลังใช้งานเสร็จ (ป้องกัน memory leak)

# ฟังก์ชันใช้สร้างตารางอัตโนมัติจาก model ทั้งหมดที่สืบทอดจาก Base
def create_tables():
    from backend.models import user_model  # ต้อง import model ก่อน เพื่อให้ SQLAlchemy เห็น
    Base.metadata.create_all(bind=engine)  # สร้างตารางตาม model ทั้งหมดที่ลงทะเบียนกับ Base



"""
 โมดูลนี้คือศูนย์กลางการจัดการฐานข้อมูลของระบบ (Database Configuration)

1. DATABASE_URL:
   - อ่านค่าจาก .env (ปลอดภัย ไม่ hard-code)
   - ใช้สร้าง engine ที่เชื่อมกับ PostgreSQL

2. SessionLocal:
   - ใช้สร้าง session ที่ไม่ autocommit/autoflush
   - ผูกกับ FastAPI ผ่าน Depends(get_db)

3. Base:
   - เป็นแม่แบบสำหรับ model ทั้งหมด เช่น User(Base)

4. get_db():
   - ใช้ใน endpoint เพื่อเปิด/ปิด session อัตโนมัติ
   - ปลอดภัย ไม่เกิด memory leak

5. create_tables():
   - เรียกใช้เพื่อสร้างตารางในฐานข้อมูลจาก model เช่น User
   - ต้อง import model ให้ครบก่อนเรียก `Base.metadata.create_all`

ใช้คู่กับ:
- FastAPI endpoint → `db: Session = Depends(get_db)`
- ระบบเริ่มต้น → `create_tables()` ตอน startup
 รองรับการขยายระบบในอนาคต เช่นเพิ่ม Alembic, Test DB, หรือหลายฐานข้อมูล
"""


from .database import get_db, create_tables, Base


"""
บรรทัดนี้นำเข้า 3 องค์ประกอบจากไฟล์ database.py:

1. `get_db`: ใช้ใน Depends เพื่อให้ FastAPI จัดการ session อัตโนมัติ
2. `create_tables`: ใช้สร้างตารางในฐานข้อมูลจาก model
3. `Base`: ใช้สำหรับสืบทอดใน SQLAlchemy models (User, Patient, etc.)

เหมาะกับใช้ใน __init__.py ของ backend/database package
ทำให้ import จากไฟล์อื่นได้ง่ายขึ้น เช่น: from backend.database import get_db

"""

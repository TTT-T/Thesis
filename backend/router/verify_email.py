#  import Router จาก FastAPI
from fastapi import APIRouter, Depends, HTTPException

#  import Session จาก SQLAlchemy (ใช้ติดต่อกับฐานข้อมูล)
from sqlalchemy.orm import Session

#  ฟังก์ชันสำหรับถอดรหัสและตรวจสอบ JWT token
from backend.utils.jwt import verify_jwt

#  ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล (SQLAlchemy dependency)
from backend.database import get_db

#  สร้าง router สำหรับจัดกลุ่ม API
router = APIRouter()

#  สร้าง endpoint GET /verify-email โดยรับ token เป็น query parameter
@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    #  ใช้ฟังก์ชัน verify_jwt เพื่อตรวจสอบว่า token ใช้ได้หรือไม่
    payload = verify_jwt(token)
    if not payload:
        # ❌ ถ้า token ไม่ valid หรือหมดอายุ → คืน error 400
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    #  ถ้า token ถูกต้อง → payload จะถูกส่งกลับมา
    # payload อาจมีข้อมูลเช่น {"sub": "user@example.com"} หรือ {"user_id": 1, "email": "..."}

    # TODO: ดำเนินการต่อ เช่น อัปเดตสถานะในฐานข้อมูลว่า verified
    # ตัวอย่าง:
    # user = db.query(User).filter(User.email == payload["sub"]).first()
    # if user:
    #     user.is_verified = True
    #     db.commit()

    #  ส่งข้อความกลับเมื่อยืนยันสำเร็จ
    return {"message": "Email verified successfully"}


"""
 Endpoint นี้ใช้สำหรับ "ยืนยันอีเมล" (Email Verification) หลังผู้ใช้สมัครสมาชิก

 วิธีทำงาน:
1. ผู้ใช้คลิกลิงก์จากอีเมล → ลิงก์มี query `token`
   เช่น: /verify-email?token=eyJhbGciOi...

2. ระบบจะ:
   - ถอดรหัส token ด้วยฟังก์ชัน verify_jwt
   - ตรวจสอบว่า token ยังไม่หมดอายุ และเป็นของจริง (ใช้ SECRET_KEY)
   - ถ้า valid → สามารถใช้ข้อมูลใน token เพื่ออัปเดตฐานข้อมูลว่า user ได้รับการยืนยันแล้ว

 หาก token ไม่ valid หรือหมดอายุ → ส่ง error 400 "Invalid or expired token"

 ใช้คู่กับ:
- ฟังก์ชัน `create_jwt` ที่ฝัง email/user_id ลงใน token
- ฟังก์ชัน `send_verification_email` ที่ส่ง token ไปยังอีเมล

 ต้องแน่ใจว่า token เป็นแบบใช้ครั้งเดียว หรือมีวันหมดอายุที่เหมาะสม

"""

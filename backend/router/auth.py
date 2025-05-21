#  import FastAPI Router และ dependencies
from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session

#  นำเข้า decode_jwt สำหรับถอดรหัส token ที่ส่งมายืนยันอีเมล
from backend.utils.security import decode_jwt

#  เชื่อมต่อฐานข้อมูล
from backend.database import get_db

#  import model User ที่ map กับตารางผู้ใช้งาน
from backend.models.user_model import User

#  import ฟังก์ชันดึง current user จาก JWT
from backend.utils.security import get_current_user

#  import สำหรับตรวจสอบและ hash password
from passlib.context import CryptContext

#  ฟังก์ชันสร้าง JWT หลัง login
from backend.utils.security import create_jwt

#  สร้าง router สำหรับกลุ่ม auth/email
router = APIRouter()

# ======  Endpoint: ยืนยันอีเมล ======
@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        #  ถอดรหัส JWT เพื่อดึง email ที่อยู่ใน field "sub"
        payload = decode_jwt(token)
        email = payload.get("sub")

        #  ถ้า token ไม่มี email → ข้อมูลผิด
        if not email:
            raise HTTPException(status_code=400, detail="ไม่พบอีเมลใน token")

        #  ค้นหาผู้ใช้จาก email ที่ได้จาก token
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")

        #  เปลี่ยนสถานะผู้ใช้ให้เป็นยืนยันแล้ว
        user.is_verified = True  # 🔒 ต้องมี field นี้ใน model
        db.commit()

        return {"message": "ยืนยันอีเมลเรียบร้อยแล้ว "}
    except Exception as e:
        #  token หมดอายุ / ปลอม → แจ้ง error
        raise HTTPException(status_code=400, detail="Token ไม่ถูกต้องหรือหมดอายุ")


# ======  Endpoint: ดึงข้อมูลผู้ใช้ปัจจุบันจาก JWT ======
@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ใช้ email จาก JWT
    email = current_user["sub"]

    # ดึงข้อมูลผู้ใช้จาก DB
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")

    # ส่งกลับข้อมูล profile เต็ม
    return {
        "email": user.email,
        "first_name_th": user.first_name_th,
        "last_name_th": user.last_name_th,
        "phone": user.phone,
        "house_no": user.house_no,
        "sub_district": user.sub_district,
        "district": user.district,
        "province": user.province,
        "postal_code": user.postal_code,
    }


#  สร้าง context สำหรับตรวจสอบ password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ======  Endpoint: login ด้วย email/password ======
@router.post("/login")
def login(
    email: str = Form(...),        #  รับจาก form-data
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    #  ค้นหา user จาก email
    user = db.query(User).filter(User.email == email).first()

    #  ถ้าไม่พบ user หรือรหัสผ่านไม่ถูกต้อง
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง")

    #  ถ้ายังไม่ยืนยันอีเมล → ห้ามเข้าสู่ระบบ
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="กรุณายืนยันอีเมลก่อน")

    #  สร้าง JWT ที่ฝัง email และ role ลงไป
    token = create_jwt({
        "sub": user.email,
        "role": user.role
    })

    return {"access_token": token, "token_type": "bearer"}



"""
📦 ระบบ Authentication + Email Verification ใน FastAPI

ประกอบด้วย 3 endpoint:

1.  /verify-email?token=...
   - ใช้ถอด JWT token ที่ส่งผ่านอีเมล
   - ตรวจสอบ email → อัปเดตสถานะ is_verified=True

2.  /me
   - ใช้ Depends(get_current_user) → คืน payload JWT ที่ decode แล้ว
   - ใช้สำหรับหน้า dashboard หรือ profile

3.  /login
   - รับ email/password จาก form
   - ตรวจสอบว่าผู้ใช้มีอยู่, รหัสผ่านถูกต้อง, และยืนยันอีเมลแล้ว
   - คืน access_token (JWT) → ใช้สำหรับเข้าถึง route ที่ต้อง login

    จุดเด่น:
- ใช้ JWT เป็น payload มาตรฐาน (sub = email, role)
- แยก role ได้ชัดเจน → ใช้กับ require_role ได้
- ปลอดภัยด้วย bcrypt + token หมดอายุ

    ระบบนี้สามารถใช้ร่วมกับ frontend Next.js ได้ทันที
เช่น: ลงทะเบียน → รับอีเมล → คลิกลิงก์ → ถูกยืนยัน → เข้าสู่ระบบ

"""

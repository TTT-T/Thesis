from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.utils.security import decode_jwt
from backend.database import get_db
from backend.models.user_model import User  # เพิ่มบรรทัดนี้
from backend.utils.security import get_current_user
from passlib.context import CryptContext
from backend.utils.security import create_jwt

router = APIRouter()

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_jwt(token)
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=400, detail="ไม่พบอีเมลใน token")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")

        user.is_verified = True  # ตรวจสอบให้แน่ใจว่ามี field นี้ใน model
        db.commit()

        return {"message": "ยืนยันอีเมลเรียบร้อยแล้ว ✅"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Token ไม่ถูกต้องหรือหมดอายุ")


@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {"email": current_user["sub"]}

from fastapi import Form

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="กรุณายืนยันอีเมลก่อน")

    # ✅ สร้าง JWT พร้อม role
    token = create_jwt({
        "sub": user.email,
        "role": user.role
    })

    return {"access_token": token, "token_type": "bearer"}

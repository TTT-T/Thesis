from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.backend.utils.security import decode_jwt
from app.backend.database import get_db
from app.backend.models.user_model import User  # เพิ่มบรรทัดนี้

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
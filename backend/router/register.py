from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user_model import User
from backend.schemas.user import RegisterUser
from backend.utils.security import hash_password
from backend.utils.email import send_verification_email
from backend.utils.jwt import create_jwt
from datetime import datetime

router = APIRouter()

@router.post("/register")
async def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    # ตรวจสอบซ้ำ
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username ซ้ำ")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email ซ้ำ")
    if db.query(User).filter(User.id_card == user.id_card).first():
        raise HTTPException(status_code=400, detail="เลขบัตรประชาชนซ้ำ")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
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
        created_at=datetime.now()
    )
    db.add(new_user)
    db.commit()

    token = create_jwt({"sub": user.email})
    await send_verification_email(user.email, token)

    return {"message": "✅ ลงทะเบียนสำเร็จ กรุณายืนยันอีเมล"}

# routes/user.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.schemas.user import RegisterUser
from app.backend.models.user_model import User
from backend.database import get_db
from backend.utils.security import hash_password
import datetime

router = APIRouter()

@router.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username มีอยู่แล้ว")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email ซ้ำ")
    
    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
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
        created_at=datetime.datetime.now()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "ลงทะเบียนสำเร็จ"}

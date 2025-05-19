# models/users.py
from sqlalchemy import Column, String, Integer, Date, TIMESTAMP
from backend.database import Base
from sqlalchemy import Boolean
from sqlalchemy import Column, String, Boolean

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    id_card = Column(String(13), unique=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    first_name_th = Column(String)
    last_name_th = Column(String)
    first_name_en = Column(String)
    last_name_en = Column(String)
    phone = Column(String)
    house_no = Column(String)
    sub_district = Column(String)
    district = Column(String)
    province = Column(String)
    postal_code = Column(String)
    blood_type = Column(String)
    rh_factor = Column(String)
    created_at = Column(TIMESTAMP)
    role = Column(String, default="user") 
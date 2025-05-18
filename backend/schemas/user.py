from typing import Annotated
from pydantic import BaseModel, EmailStr, constr, validator

class RegisterUser(BaseModel):
    username: Annotated[str, constr(min_length=4)]
    email: EmailStr
    confirm_email: EmailStr
    password: Annotated[str, constr(min_length=8)]
    confirm_password: str
    id_card: Annotated[str, constr(min_length=13, max_length=13)]
    phone: str | None = None
    first_name_th: str
    last_name_th: str
    first_name_en: str | None = None
    last_name_en: str | None = None
    birth_date: str
    house_no: str
    sub_district: str
    district: str
    province: str
    postal_code: str
    blood_type: str
    rh_factor: str

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("รหัสผ่านไม่ตรงกัน")
        return v

    @validator("confirm_email")
    def emails_match(cls, v, values):
        if "email" in values and v != values["email"]:
            raise ValueError("อีเมลไม่ตรงกัน")
        return v
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from thesis.backend.utils.jwt import verify_jwt
from backend.database import get_db

router = APIRouter()

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    payload = verify_jwt(token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    # ...ดำเนินการต่อ เช่น อัปเดตสถานะ user ว่า verified...
    return {"message": "Email verified successfully"}
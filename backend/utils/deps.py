from fastapi import Depends, HTTPException
from backend.utils.security import get_current_user

def require_role(allowed_roles: list[str]):
    def checker(user=Depends(get_current_user)):
        user_role = user.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์เข้าถึง")
        return user
    return checker

# backend/utils/deps.py
def require_role(allowed_roles: list[str]):
    def checker(user=Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์เข้าถึง")
        return user
    return checker
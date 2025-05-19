# backend/router/dashboard.py
from fastapi import APIRouter, Depends
from backend.utils.deps import require_role

router = APIRouter()

@router.get("/dashboard", tags=["Dashboard"])
def access_dashboard(current_user=Depends(require_role(["admin", "superadmin"]))):
    return {
        "message": f"Welcome to admin dashboard, {current_user['sub']}",
        "role": current_user["role"]
    }

# ===== import เดิม =====
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user_model import User
from backend.utils.deps import require_role

# ===== สร้าง Router =====
router = APIRouter()

# ✅ พื้นที่เฉพาะ admin/superadmin
@router.get("/admin-area")
def admin_area(current_user=Depends(require_role(["admin", "superadmin"]))):
    return {"msg": f"ยินดีต้อนรับ {current_user['role']} {current_user['sub']}"}

# ✅ ดึงผู้ใช้ทั้งหมด (เฉพาะ admin/superadmin)
@router.get("/admin/users")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "superadmin"]))
):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        } for user in users
    ]

# ✅ เปลี่ยน role ของผู้ใช้
@router.patch("/admin/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "superadmin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")
    
    user.role = role
    db.commit()
    return {"message": "เปลี่ยน role สำเร็จ"}

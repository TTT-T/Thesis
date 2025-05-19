from fastapi import APIRouter, Depends
from backend.utils.deps import require_role

router = APIRouter()

@router.get("/admin-area")
def admin_area(current_user=Depends(require_role(["admin", "superadmin"]))):
    return {"msg": f"ยินดีต้อนรับ {current_user['role']} {current_user['sub']}"}

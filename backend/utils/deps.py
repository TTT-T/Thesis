#  import จาก FastAPI
from fastapi import Depends, HTTPException

#  ฟังก์ชันดึงผู้ใช้ปัจจุบันจาก token (ต้องมีการ implement decode JWT แล้ว)
from backend.utils.security import get_current_user


#  ฟังก์ชันหลัก ใช้สำหรับตรวจสอบว่า role ของ user มีสิทธิ์หรือไม่
def require_role(allowed_roles: list[str]):
    #  สร้าง inner function ที่ FastAPI จะใช้เป็น Dependency
    def checker(user=Depends(get_current_user)):
        user_role = user.get("role")  #  ดึง role จาก payload ของ JWT

        #  ตรวจสอบว่า role นี้มีอยู่ใน allowed_roles หรือไม่
        if user_role not in allowed_roles:
            raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์เข้าถึง")

        return user  #  คืนข้อมูล user ให้ endpoint นำไปใช้ต่อ
    return checker  #  ส่งกลับ inner function เพื่อให้ใช้ใน Depends()


"""
 ฟังก์ชันนี้ใช้สำหรับ 'การควบคุมสิทธิ์' (Authorization) แบบ role-based ใน FastAPI

 วิธีใช้งาน:
    - ใน route ใดก็ตามที่ต้องการจำกัดสิทธิ์:
    
        @app.get("/admin-only")
        def admin_only(user=Depends(require_role(["admin"]))):
            return {"msg": "ยินดีต้อนรับแอดมิน"}

 วิธีทำงาน:
    - รับ parameter เป็นรายชื่อ role ที่ได้รับอนุญาต เช่น ["admin", "superuser"]
    - ใช้ร่วมกับ get_current_user ที่ decode JWT และคืน payload เช่น {"sub": ..., "role": ...}
    - ถ้า role ของผู้ใช้ไม่อยู่ในรายการ → คืน HTTP 403 Forbidden

 ใช้คู่กับระบบ JWT Auth เช่น login แล้วได้ token ที่มี field `role`
"""

#  import APIRouter สำหรับสร้างกลุ่มเส้นทาง API
from fastapi import APIRouter, Depends

#  import ฟังก์ชันตรวจสอบสิทธิ์ role จาก utils
from backend.utils.deps import require_role

#  สร้าง router สำหรับเส้นทาง dashboard (เช่น /dashboard)
router = APIRouter()

#  สร้าง endpoint GET /dashboard โดยจำกัดสิทธิ์เฉพาะ role: "admin" หรือ "superadmin"
@router.get("/dashboard", tags=["Dashboard"])
def access_dashboard(current_user=Depends(require_role(["admin", "superadmin"]))):
    #  current_user คือ payload จาก JWT (หลังผ่านการ decode แล้ว)
    return {
        "message": f"Welcome to admin dashboard, {current_user['sub']}",  # sub = email หรือ user_id
        "role": current_user["role"]  # แสดง role ของผู้ใช้
    }


"""
 Endpoint นี้ใช้สำหรับแสดงข้อมูลแดชบอร์ดเฉพาะ 'admin' หรือ 'superadmin'

 ฟังก์ชัน require_role(["admin", "superadmin"]):
   - ดึง token จาก header Authorization: Bearer <token>
   - ถอดรหัส JWT และตรวจสอบว่า role ของ user อยู่ในรายการที่อนุญาต
   - ถ้าไม่ผ่าน → ส่งกลับ 403 Forbidden

 ฟังก์ชันนี้จะ return:
   {
       "message": "Welcome to admin dashboard, example@email.com",
       "role": "admin"
   }

 ใช้งานกับ FastAPI อย่างปลอดภัยและขยายต่อได้ เช่น:
   - เพิ่ม role "doctor", "nurse"
   - แยก dashboard ตามสิทธิ์
   - ใช้ร่วมกับ UI แสดงเฉพาะเมนูที่อนุญาตเท่านั้น

 เหมาะสำหรับใช้ควบคุม "สิทธิ์การเข้าถึง" โดยใช้ JWT token + role-based access control
"""

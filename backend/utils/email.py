#  import module พื้นฐาน
import os
import smtplib
from email.message import EmailMessage  # สำหรับสร้างอีเมลแบบ text/plain
from dotenv import load_dotenv          # สำหรับโหลดค่าจากไฟล์ .env

#  โหลดค่าจาก .env เพื่อใช้ใน SMTP config
load_dotenv()  # ต้องเรียกก่อน os.getenv จะใช้งานได้

#  ตั้งค่าที่ใช้ส่งอีเมล โดยโหลดจาก .env
EMAIL_FROM = os.getenv("EMAIL_FROM")             # อีเมลผู้ส่ง
SMTP_SERVER = os.getenv("SMTP_SERVER")           # เซิร์ฟเวอร์ SMTP เช่น smtp.gmail.com
SMTP_PORT = int(os.getenv("SMTP_PORT"))          # พอร์ต SMTP เช่น 587 (STARTTLS)
SMTP_USER = os.getenv("SMTP_USER")               # บัญชีผู้ใช้ SMTP
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")       # รหัสผ่าน SMTP (App Password สำหรับ Gmail)

#  ฟังก์ชันสำหรับส่งอีเมลยืนยัน (async แต่ใช้กับ sync SMTP เพราะง่ายต่อการใช้)
async def send_verification_email(to_email: str, token: str):
    try:
        #  สร้างลิงก์สำหรับให้ผู้ใช้คลิกยืนยันอีเมล
        verify_link = f"http://localhost:3000/verify-email?token={token}"
        # สามารถเปลี่ยนให้เป็น URL บน Production เช่น https://your-domain.com/verify-email

        #  สร้างข้อความอีเมลแบบ plain text
        msg = EmailMessage()
        msg["Subject"] = "ยืนยันอีเมลของคุณ - ระบบเวชระเบียน"
        msg["From"] = EMAIL_FROM
        msg["To"] = to_email
        msg.set_content(f"""
        สวัสดี,

        กรุณาคลิกลิงก์ด้านล่างเพื่อยืนยันอีเมลของคุณ:
        {verify_link}

        หากคุณไม่ได้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้

        ขอบคุณ,
        ทีมงานระบบเวชระเบียน
        """)

        #  เชื่อมต่อ SMTP Server และส่งอีเมล
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # เข้ารหัสการเชื่อมต่อ (STARTTLS)
            server.login(SMTP_USER, SMTP_PASSWORD)  # ล็อกอินด้วย App Password
            server.send_message(msg)  # ส่งอีเมล

        print(" ส่งอีเมลยืนยันไปยัง", to_email)
    except Exception as e:
        #  หากมีข้อผิดพลาดให้แสดงใน console
        print("❌ ส่งอีเมลล้มเหลว:", str(e))
        raise  # ส่ง error กลับไปยัง caller เช่น FastAPI endpoint


"""
ฟังก์ชันนี้ใช้ส่งอีเมลยืนยันตัวตนไปยังอีเมลของผู้ใช้ โดยทำงานดังนี้:

1. รับ `to_email` (อีเมลผู้รับ) และ `token` (JWT หรือ UUID ที่ใช้ยืนยัน)
2. สร้างข้อความอีเมลโดยใส่ลิงก์ยืนยัน เช่น http://localhost:3000/verify-email?token=abc123
3. ใช้ `smtplib` เชื่อมต่อ SMTP Server (เช่น Gmail) ผ่าน STARTTLS
4. ส่งข้อความอีเมลแบบ plain text ไปยังผู้ใช้
5. หากเกิดข้อผิดพลาด เช่น ล็อกอินไม่ได้, อีเมลผิด → แสดง error และ `raise` ออกไปให้ FastAPI จัดการ

 ใช้งานร่วมกับระบบสมัครสมาชิก เมื่อผู้ใช้ลงทะเบียน → สร้าง token → ส่งอีเมลนี้
 ปลอดภัยเพราะใช้ App Password แทนรหัส Gmail จริง และไม่ hardcode ค่าไว้ในโค้ด
"""
#  หมายเหตุ: ควรมีการทดสอบและตรวจสอบความปลอดภัยเพิ่มเติม
#  ควรมีการจัดการข้อผิดพลาดที่ดีกว่า เช่น ส่งอีเมลล้มเหลวให้ผู้ใช้ทราบ
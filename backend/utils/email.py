import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()  # โหลดค่าจาก .env

EMAIL_FROM = os.getenv("EMAIL_FROM")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


async def send_verification_email(to_email: str, token: str):
    try:
        verify_link = f"http://localhost:3000/verify-email?token={token}"  # เปลี่ยนเป็น production URL ได้

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

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        print("✅ ส่งอีเมลยืนยันไปยัง", to_email)
    except Exception as e:
        print("❌ ส่งอีเมลล้มเหลว:", str(e))
        raise

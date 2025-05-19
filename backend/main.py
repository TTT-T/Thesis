from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.router import auth, register, admin  # ✅ รวม router ที่ใช้
from backend.database import create_tables

from backend.router import auth, register, admin
from backend.router import auth, register, dashboard

# ====== ค่าคงที่ ======
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeyforjwt123456789")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ✅ ประกาศ FastAPI ก่อนใช้งาน
app = FastAPI()

# ✅ Middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include router หลังจากประกาศ app
app.include_router(auth.router)
app.include_router(register.router)
app.include_router(admin.router)
app.include_router(dashboard.router)


# ✅ Event ตอน startup
@app.on_event("startup")
def startup():
    create_tables()
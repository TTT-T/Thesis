from dotenv import load_dotenv
load_dotenv()

import os
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeyforjwt123456789")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

from fastapi import FastAPI
from backend.router import register, auth
from backend.database import create_tables
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # เพิ่ม origins อื่น ๆ ที่จำเป็น
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # หรือใช้ ["*"] เพื่ออนุญาตทุก origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(auth.router)

@app.on_event("startup")
def startup():
    create_tables()
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from jose import jwt

# โหลด .env
load_dotenv()

# โหลด SECRET_KEY แบบปลอดภัย
SECRET_KEY = os.getenv("SECRET_KEY") or "supersecretkeyforjwt123456789"
ALGORITHM = os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 30)

def create_jwt(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception as e:
        print("JWT decode error:", e)
        return None
    

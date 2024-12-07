# auth.py

from datetime import datetime, timedelta
from typing import Dict, Optional
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from database import users_collection
from bson import ObjectId
from passlib.hash import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is not set in the .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str = Depends(oauth2_scheme)):
    try:
        print(f"Token received: {token}")  # For debugging, remember to remove in production
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials. Token might be expired or invalid.",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"user_id": str(user["_id"]), "email": user["email"]}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

def create_user(user_data: dict):
    if users_collection.find_one({"email": user_data["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password = user_data.pop("password", None) 
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    
    user_data["password"] = hash_password(password)
    users_collection.insert_one(user_data)

def authenticate_user(email: str, password: str):
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user

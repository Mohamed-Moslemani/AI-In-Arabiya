from datetime import datetime, timedelta 
from jose import JWTError, jwt 
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from settings import Settings  

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = Settings.SECRET_KEY 
ALGORITHM = Settings.ALGORITHM 
ACCESS_TOKEN_EXPIRE_MINUTES = Settings.ACCESS_TOKEN_EXPIRE_MINUTES 

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401, 
            detail="Could not validate credentials or token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )

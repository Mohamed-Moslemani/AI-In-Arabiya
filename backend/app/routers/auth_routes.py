from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserSignup, UserLogin, UserProfileUpdate
from app.auth.auth import create_user, authenticate_user, decode_access_token, oauth2_scheme
from app.database import users_collection
from bson import ObjectId
from app.routers.jwt import create_access_token

router = APIRouter()

# Signup endpoint
@router.post("/signup")
async def signup(user: UserSignup):
    create_user(user.dict())
    return {"message": "تم التسجيل بنجاح"}

# Login endpoint
@router.post("/login")
async def login(user: UserLogin):
    db_user = authenticate_user(user.email, user.password)
    access_token = create_access_token({"user_id": str(db_user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

# Utility function to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    print(f"Token Received: {token}")  # Debugging
    payload = decode_access_token(token)
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="الرمز غير صالح")
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    
    return {"user_id": str(user["_id"]), "email": user["email"]}


# Get profile endpoint
@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    user_data = users_collection.find_one({"_id": ObjectId(user["user_id"])})
    if not user_data:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    
    user_data["_id"] = str(user_data["_id"])  # Convert ObjectId to string
    user_data.pop("password", None)  # Remove sensitive data
    return {"profile": user_data}

# Update profile endpoint
@router.put("/profile")
async def update_profile(profile_data: UserProfileUpdate, user=Depends(get_current_user)):
    updated_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not updated_data:
        raise HTTPException(status_code=400, detail="لا توجد بيانات لتحديثها")
    
    users_collection.update_one({"_id": ObjectId(user["user_id"])}, {"$set": updated_data})
    return {"message": "تم تحديث الملف الشخصي بنجاح"}

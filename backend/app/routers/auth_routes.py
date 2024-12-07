from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserSignup, UserLogin, UserProfileUpdate
from app.auth.auth import create_user, authenticate_user, decode_access_token, oauth2_scheme
from database import users_collection
from bson import ObjectId
from app.routers.jwt import create_access_token
from app.auth.auth import create_user, authenticate_user
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
    if db_user:
        access_token = create_access_token({"user_id": str(db_user["_id"])})
        print(f"Access token generated: {access_token}")  # Debugging
        return {"access_token": access_token}
    raise HTTPException(status_code=401, detail="Invalid credentials")


def get_current_user(token: dict = Depends(decode_access_token)):
    user_id = token.get("user_id")
    print(f"Decoded user ID: {user_id}")  # Debugging line
    if not user_id:
        raise HTTPException(status_code=403, detail="Invalid token")
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert _id to string and remove sensitive data
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user

@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    return {"profile": user}

# Update profile endpoint
@router.put("/profile")
async def update_profile(profile_data: UserProfileUpdate, user=Depends(get_current_user)):
    updated_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not updated_data:
        raise HTTPException(status_code=400, detail="لا توجد بيانات لتحديثها")
    
    # Use the string _id from the user dictionary
    users_collection.update_one({"_id": ObjectId(user["_id"])}, {"$set": updated_data})
    return {"message": "تم تحديث الملف الشخصي بنجاح"}
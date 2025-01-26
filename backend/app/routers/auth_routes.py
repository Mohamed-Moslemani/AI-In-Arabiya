from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from app.schemas.user_schema import UserSignup, UserLogin, UserProfileUpdate
from app.auth.auth import create_user, authenticate_user, decode_access_token, oauth2_scheme
from database import users_collection
from bson import ObjectId
from app.routers.jwt import create_access_token
import os 
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError
import uuid
import re 

load_dotenv()
router = APIRouter()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

# Signup endpoint
@router.post("/signup")
async def signup(user: UserSignup):
    try:
        if not re.match(r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", user.password):
            raise HTTPException(
                status_code=400,
                detail="Password must have at least 8 characters, one capital letter, one number, and one symbol.",
            )
        create_user(user.dict())
        return {"message": "تم التسجيل بنجاح"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Validation error: {str(e)}")

# Login endpoint
@router.post("/login")
async def login(user: UserLogin):
    db_user = authenticate_user(user.email, user.password)
    if db_user:
        access_token = create_access_token({"user_id": str(db_user["_id"])})
        print(f"Access token generated: {access_token}") 
        return {"access_token": access_token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

def get_current_user(token: dict = Depends(decode_access_token)):
    user_id = token.get("user_id")
    print(f"Decoded user ID: {user_id}")  # Debugging
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
    """
    Returns the user profile data as JSON.
    """
    return {"profile": user}

# Update profile endpoint
@router.put("/profile")
async def update_profile(profile_data: UserProfileUpdate, user=Depends(get_current_user)):
    """
    Updates the user's profile in the database.
    Only fields that are not None will be updated.
    """
    updated_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not updated_data:
        raise HTTPException(status_code=400, detail="لا توجد بيانات لتحديثها")
    
    # Use the string _id from the user dictionary to update DB
    users_collection.update_one({"_id": ObjectId(user["_id"])}, {"$set": updated_data})
    return {"message": "تم تحديث الملف الشخصي بنجاح"}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_FILE_TYPES = {"image/jpeg", "image/png", "image/jpg"}

# Avatar upload endpoint
@router.put("/profile/avatar")
async def upload_avatar(file: UploadFile = File(...), user=Depends(get_current_user)):
    """
    Uploads a new avatar image to AWS S3 and updates the user's avatar_url in the DB.
    """
    # Validate file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail="نوع الملف غير مدعوم. يُرجى رفع صورة بصيغة JPEG أو PNG فقط."
        )

    # Read the file into memory to check its size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail="حجم الملف أكبر من الحد المسموح به (5 ميجابايت)."
        )
    
    file.file.seek(0)

    unique_filename = f"avatars/{uuid.uuid4().hex}_{file.filename}"

    try:
        # Upload the file to AWS S3
        s3_client.upload_fileobj(
            file.file,
            AWS_BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": file.content_type},
        )
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="خطأ في الاتصال بخدمة S3.")

    file_url = s3_client.generate_presigned_url(
    'get_object',
    Params={'Bucket': AWS_BUCKET_NAME, 'Key': unique_filename},
)

    users_collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"avatar_url": file_url}},
    )

    return {"avatar_url": file_url, "message": "تم تحديث الصورة الشخصية بنجاح."}

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict

class UserSignup(BaseModel):
    name: str = Field(..., example="محمد")
    age: Optional[int] = Field(None, ge=13, le=100, example=25)
    email: EmailStr = Field(..., example="example@example.com")
    phone_number: Optional[str] = Field(None, example="123456789")
    gender: Optional[str] = Field(None, example="ذكر")
    date_of_birth: Optional[str] = Field(None, example="1998-01-01")
    country: Optional[str] = Field(None, example="السعودية")
    city: Optional[str] = Field(None, example="الرياض")
    study_level: str = Field(..., example="طالب جامعي")
    programming_skills: Optional[List[str]] = Field(None, example=["Python", "JavaScript"])
    interests: Optional[List[str]] = Field(None, example=["تعلم الآلة", "رؤية الكمبيوتر"])
    preferred_learning_style: Optional[str] = Field(None, example="مرئي")
    daily_routine: Optional[Dict[str, int]] = Field(
        None,
        example={"working_hours": 8, "laptop_hours": 5, "physical_activity_hours": 1},
    )
    goals: Optional[str] = Field(None, example="تعلم الذكاء الاصطناعي لتحسين الوظائف")
    challenges: Optional[str] = Field(None, example="إيجاد الوقت الكافي للدراسة")
    password: str = Field(..., example="secure_password")
    confirm_password: str = Field(..., example="Retype Password")

    avatar_url: Optional[str] = Field(None, example="https://example.com/photo.jpg")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    photo_url: Optional[str] = Field(None, example="https://example.com/photo.jpg")
    bio: Optional[str] = Field(None, example="طالب مهتم بمجال الذكاء الاصطناعي")
    city: Optional[str] = Field(None, example="بيروت")
    country: Optional[str] = Field(None, example="لبنان")
    gender: Optional[str] = Field(None, example="ذكر")
    date_of_birth: Optional[str] = Field(None, example="1998-01-01")
    programming_skills: Optional[List[str]] = Field(None, example=["Python", "JavaScript"])
    interests: Optional[List[str]] = Field(None, example=["تعلم الآلة", "رؤية الكمبيوتر"])
    preferred_learning_style: Optional[str] = Field(None, example="مرئي")
    daily_routine: Optional[Dict[str, int]] = Field(
        None,
        example={"working_hours": 8, "laptop_hours": 5, "physical_activity_hours": 1},
    )
    goals: Optional[str] = Field(None, example="الانتقال إلى مهنة في الذكاء الاصطناعي")
    challenges: Optional[str] = Field(None, example="إيجاد الوقت الكافي للدراسة")
    avatar_url: Optional[str] = Field(None, example="https://example.com/photo.jpg")
    exam_answers: Optional[List[Dict[str, List[Dict[str, str]]]]] = Field(
        None,
        example=[
            {
                "exam_id": "123",
                "answers": [{"question_id": "q1", "answer": "تعلم الآلة"}],
            }
        ],
    )

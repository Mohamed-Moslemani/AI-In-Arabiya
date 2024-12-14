from fastapi import APIRouter, HTTPException, Depends
from models import exams_collection, users_collection
from schemas.exam_schema import ExamSchema, UserAnswerSchema
from bson import ObjectId

router = APIRouter()

# Route to create a new exam
@router.post("/exam", response_description="إنشاء امتحان جديد")
async def create_exam(exam: ExamSchema):
    new_exam = exam.dict()
    result = exams_collection.insert_one(new_exam)
    return {"message": "تم إنشاء الامتحان بنجاح", "exam_id": str(result.inserted_id)}

# Route to fetch all exams
@router.get("/exam", response_description="الحصول على جميع الامتحانات")
async def get_exams():
    exams = list(exams_collection.find())
    for exam in exams:
        exam["_id"] = str(exam["_id"])
    return exams

# Route to fetch a specific exam
@router.get("/exam/{exam_id}", response_description="الحصول على امتحان معين")
async def get_exam(exam_id: str):
    exam = exams_collection.find_one({"_id": ObjectId(exam_id)})
    if not exam:
        raise HTTPException(status_code=404, detail="الامتحان غير موجود")
    exam["_id"] = str(exam["_id"])
    return exam

# Route to submit answers
@router.post("/exam/submit", response_description="إرسال إجابات الامتحان")
async def submit_exam_answers(user_answers: UserAnswerSchema):
    # Validate exam exists
    exam = exams_collection.find_one({"_id": ObjectId(user_answers.exam_id)})
    if not exam:
        raise HTTPException(status_code=404, detail="الامتحان غير موجود")

    # Store user answers in the database
    users_collection.update_one(
        {"_id": ObjectId(user_answers.user_id)},
        {"$push": {"exam_answers": user_answers.dict()}}
    )
    return {"message": "تم إرسال الإجابات بنجاح"}

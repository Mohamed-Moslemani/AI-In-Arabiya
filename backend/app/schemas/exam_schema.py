from pydantic import BaseModel, Field
from typing import List, Optional, Union

# Schema for individual question
class QuestionSchema(BaseModel):
    question_text: str = Field(..., example="ما هو الذكاء الاصطناعي؟")
    question_type: str = Field(..., example="mcq", regex="^(mcq|true_false|fill_blank|drag_drop|code)$")
    options: Optional[List[str]] = Field(
        None, example=["تعلم الآلة", "رؤية الكمبيوتر", "معالجة اللغة الطبيعية"]
    )  # For MCQ and True/False
    correct_answer: Union[str, List[str]] = Field(
        ...,
        example="تعلم الآلة",  # Single answer for MCQ/True-False or List for multiple correct answers
    )
    explanation: Optional[str] = Field(
        None, example="الذكاء الاصطناعي هو ..."
    )  # Explanation for the answer

# Schema for an exam
class ExamSchema(BaseModel):
    title: str = Field(..., example="امتحان الذكاء الاصطناعي - المستوى الأول")
    description: Optional[str] = Field(
        None, example="هذا الامتحان يختبر معلوماتك في مواضيع الذكاء الاصطناعي الأساسية."
    )
    questions: List[QuestionSchema] = Field(
        ..., example=[{"question_text": "ما هو الذكاء الاصطناعي؟", "question_type": "mcq"}]
    )
    duration_minutes: Optional[int] = Field(
        None, example=30
    )  # Time limit for the exam

# Schema for user answers
class UserAnswerSchema(BaseModel):
    exam_id: str = Field(..., example="64832b8f-c8ab-4b9e-bb4c-8b2b5d3f8964")
    user_id: str = Field(..., example="64a83b9f-c1ab-4b9e-bc9c-9b2b5d3f8965")
    answers: List[dict] = Field(
        ..., example=[{"question_id": "q1", "answer": "تعلم الآلة"}]
    )

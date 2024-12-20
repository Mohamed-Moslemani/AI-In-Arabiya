import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/exam/${examId}`);
        setExam(res.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الامتحان.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://localhost:8000/exam/submit",
        {
          exam_id: examId,
          user_id: "current_user_id", // Replace with actual logged-in user ID
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            question_id: questionId,
            answer,
          })),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("تم إرسال الإجابات بنجاح!");
      navigate("/exams");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال الإجابات.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-blue-600 animate-pulse">جاري تحميل الامتحان...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">{exam.title}</h1>
        <p className="text-gray-700 mb-8">{exam.description}</p>
        {exam.questions.map((question, index) => (
          <div key={index} className="mb-6">
            <p className="text-lg font-medium mb-2">
              {index + 1}. {question.question_text}
            </p>
            {question.question_type === "mcq" && (
              <div className="space-y-2">
                {question.options.map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      onChange={() => handleAnswerChange(question._id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {question.question_type === "true_false" && (
              <div className="space-y-2">
                {["صح", "خطأ"].map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      onChange={() => handleAnswerChange(question._id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {question.question_type === "fill_blank" && (
              <input
                type="text"
                placeholder="أكمل الإجابة"
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          إرسال الإجابات
        </button>
      </div>
    </div>
  );
};

export default TakeExam;

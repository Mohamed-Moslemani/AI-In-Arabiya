import React, { useState } from "react";
import axios from "axios";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  const [options, setOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: questionText, question_type: questionType, options, correct_answer: correctAnswer },
    ]);
    setQuestionText("");
    setQuestionType("mcq");
    setOptions([""]);
    setCorrectAnswer("");
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/exam/private",
        { title, description, questions },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("تم إنشاء الامتحان بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إنشاء الامتحان.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">إنشاء امتحان جديد</h1>
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الامتحان"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف الامتحان"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Add Questions */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">إضافة سؤال</h2>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="نص السؤال"
            className="w-full p-2 border rounded"
          />
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="mcq">اختيار من متعدد</option>
            <option value="true_false">صح أو خطأ</option>
            <option value="fill_blank">إكمال الفراغ</option>
          </select>
          {questionType === "mcq" && (
            <>
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`الخيار ${index + 1}`}
                  className="w-full p-2 border rounded mt-2"
                />
              ))}
              <button
                onClick={() => setOptions([...options, ""])}
                className="mt-2 text-blue-600 underline"
              >
                إضافة خيار آخر
              </button>
            </>
          )}
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="الإجابة الصحيحة"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddQuestion}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            إضافة السؤال
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          حفظ الامتحان
        </button>
      </div>
    </div>
  );
};

export default CreateExam;

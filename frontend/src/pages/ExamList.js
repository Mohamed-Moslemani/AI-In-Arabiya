import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExamsList = () => {
  const [publicExams, setPublicExams] = useState([]);
  const [privateExams, setPrivateExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        // Fetch public exams
        const publicRes = await axios.get("http://localhost:8000/exam");
        setPublicExams(publicRes.data);

        // Fetch private exams for the logged-in user
        const privateRes = await axios.get(
          "http://localhost:8000/exam/private",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPrivateExams(privateRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-blue-600 animate-pulse">جاري تحميل الامتحانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">الامتحانات</h1>

        {/* Public Exams */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            امتحانات عامة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/exam/${exam._id}`)}
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {exam.title}
                </h3>
                <p className="text-gray-600">{exam.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Private Exams */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            امتحاناتك الخاصة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/exam/${exam._id}`)}
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {exam.title}
                </h3>
                <p className="text-gray-600">{exam.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate("/create-exam")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              إنشاء امتحان جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsList;

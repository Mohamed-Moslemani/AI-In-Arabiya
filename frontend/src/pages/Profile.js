import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null); // User data state
  const [loading, setLoading] = useState(true); // Loading state for API
  const [error, setError] = useState(null); // Error state for API
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend (replace with your API endpoint)
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Assuming you are using a token for auth
          },
        });
        setUserData(response.data); // Store the user data in the state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError("Error loading user data");
        setLoading(false); // Set loading to false on error
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
        مرحبا بك في ملفك الشخصي
      </h1>

      {/* Profile Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Side: Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">المعلومات الشخصية</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الاسم:</span>
              <span className="text-blue-600">{userData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">العمر:</span>
              <span className="text-blue-600">{userData.age} سنة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">البريد الإلكتروني:</span>
              <span className="text-blue-600">{userData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">رقم الهاتف:</span>
              <span className="text-blue-600">{userData.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الجنس:</span>
              <span className="text-blue-600">{userData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">تاريخ الميلاد:</span>
              <span className="text-blue-600">{userData.date_of_birth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الدولة:</span>
              <span className="text-blue-600">{userData.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">المدينة:</span>
              <span className="text-blue-600">{userData.city}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Additional Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">المزيد من المعلومات</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">المستوى الدراسي:</span>
              <span className="text-blue-600">{userData.study_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">المهارات البرمجية:</span>
              <span className="text-blue-600">{userData.programming_skills.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الاهتمامات:</span>
              <span className="text-blue-600">{userData.interests.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">أسلوب التعلم المفضل:</span>
              <span className="text-blue-600">{userData.preferred_learning_style}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الروتين اليومي:</span>
              <span className="text-blue-600">
                ساعات العمل: {userData.daily_routine.working_hours}، ساعات الكمبيوتر: {userData.daily_routine.laptop_hours}، 
                ساعات النشاط البدني: {userData.daily_routine.physical_activity_hours}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">الأهداف:</span>
              <span className="text-blue-600">{userData.goals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">التحديات:</span>
              <span className="text-blue-600">{userData.challenges}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          تعديل الملف الشخصي
        </button>
      </div>
    </div>
  );
};

export default Profile;

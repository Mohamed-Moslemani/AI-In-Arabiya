import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setError("يرجى تسجيل الدخول للوصول إلى ملفك الشخصي");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/auth/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data.profile);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          handleAxiosError(err);
        } else {
          setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle Axios-specific errors
  const handleAxiosError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      setError("الجلسة انتهت. يرجى تسجيل الدخول مرة أخرى");
      navigate("/login");
    } else if (err.response?.status >= 500) {
      setError("خطأ في الخادم. حاول مرة أخرى لاحقًا.");
    } else {
      setError(err.response?.data?.detail || "خطأ في تحميل البيانات.");
    }
  };

  // Render a default value if the field is null or undefined
  const renderValue = (value, defaultValue = "غير متوفر") => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : defaultValue;
    }
    return value !== undefined && value !== null ? value : defaultValue;
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-blue-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  // Handle case when user data is missing
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  // Render Profile Page
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
        مرحبا بك في ملفك الشخصي
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Personal Information Section */}
        <ProfileSection
          title="المعلومات الشخصية"
          items={[
            { label: "الاسم", value: userData.name },
            { label: "العمر", value: `${userData.age} سنة` },
            { label: "البريد الإلكتروني", value: userData.email },
            { label: "رقم الهاتف", value: userData.phone_number },
            { label: "الجنس", value: userData.gender },
            { label: "تاريخ الميلاد", value: userData.date_of_birth },
            { label: "الدولة", value: userData.country },
            { label: "المدينة", value: userData.city },
          ]}
        />

        {/* Additional Information Section */}
        <ProfileSection
          title="المزيد من المعلومات"
          items={[
            { label: "المستوى الدراسي", value: userData.study_level },
            { label: "المهارات البرمجية", value: userData.programming_skills },
            { label: "الاهتمامات", value: userData.interests },
            { label: "أسلوب التعلم المفضل", value: userData.preferred_learning_style },
            {
              label: "الروتين اليومي",
              value: `ساعات العمل: ${renderValue(userData.daily_routine?.working_hours, 0)}، 
                      ساعات الكمبيوتر: ${renderValue(userData.daily_routine?.laptop_hours, 0)}، 
                      ساعات النشاط البدني: ${renderValue(userData.daily_routine?.physical_activity_hours, 0)}`,
            },
            { label: "الأهداف", value: userData.goals },
            { label: "التحديات", value: userData.challenges },
          ]}
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/update-profile")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          تعديل الملف الشخصي
        </button>
      </div>
    </div>
  );
};

// Reusable Profile Section Component
const ProfileSection = ({ title, items }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-blue-700 mb-4">{title}</h2>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between">
          <span className="text-gray-600 font-medium">{item.label}:</span>
          <span className="text-blue-600">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Profile;

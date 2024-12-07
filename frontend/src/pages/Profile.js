import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("personal"); // Added state for tab selection
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-blue-600 animate-pulse">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  // Handle case when user data is missing
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500">لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  const profileImage = userData.avatar_url || "https://via.placeholder.com/150";

  const personalInfo = [
    { label: "الاسم", value: userData.name },
    { label: "العمر", value: `${renderValue(userData.age, "غير متوفر")} سنة` },
    { label: "البريد الإلكتروني", value: userData.email },
    { label: "رقم الهاتف", value: userData.phone_number },
    { label: "الجنس", value: userData.gender },
    { label: "تاريخ الميلاد", value: userData.date_of_birth },
    { label: "الدولة", value: userData.country },
    { label: "المدينة", value: userData.city },
  ];

  const additionalInfo = [
    { label: "المستوى الدراسي", value: userData.study_level },
    { label: "المهارات البرمجية", value: renderValue(userData.programming_skills) },
    { label: "الاهتمامات", value: renderValue(userData.interests) },
    {
      label: "أسلوب التعلم المفضل",
      value: userData.preferred_learning_style,
    },
    {
      label: "الروتين اليومي",
      value: `ساعات العمل: ${renderValue(userData.daily_routine?.working_hours, 0)}, 
                      ساعات الكمبيوتر: ${renderValue(userData.daily_routine?.laptop_hours, 0)}, 
                      ساعات النشاط البدني: ${renderValue(userData.daily_routine?.physical_activity_hours, 0)}`,
    },
    { label: "الأهداف", value: userData.goals },
    { label: "التحديات", value: userData.challenges },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Hero */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 shadow-lg">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            مرحبا {renderValue(userData.name, "")}!
          </h1>
          <p className="text-gray-700 text-sm md:text-base">
            هنا يمكنك مراجعة وتعديل معلوماتك الشخصية ومعلوماتك الإضافية.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs for switching info */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedTab("personal")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedTab === "personal"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-600"
            }`}
          >
            المعلومات الشخصية
          </button>
          <button
            onClick={() => setSelectedTab("additional")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedTab === "additional"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-600"
            }`}
          >
            المزيد من المعلومات
          </button>
        </div>

        {/* Conditional Rendering Based on Selected Tab */}
        {selectedTab === "personal" && (
          <ProfileSection
            title="المعلومات الشخصية"
            icon={<FaUserCircle className="text-blue-700" />}
            items={personalInfo}
          />
        )}
        {selectedTab === "additional" && (
          <ProfileSection
            title="المزيد من المعلومات"
            icon={<FaUserCircle className="text-blue-700" />}
            items={additionalInfo}
          />
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/update-profile")}
            className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaUserEdit />
            تعديل الملف الشخصي
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Profile Section Component
const ProfileSection = ({ title, items, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition max-w-3xl mx-auto">
    <div className="flex items-center gap-2 mb-4 border-b border-blue-100 pb-2">
      {icon}
      <h2 className="text-2xl font-semibold text-blue-700">{title}</h2>
    </div>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
        >
          <span className="text-gray-700 font-medium">{item.label}:</span>
          <span className="text-blue-700 font-semibold">
            {item.value || "غير متوفر"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Profile;

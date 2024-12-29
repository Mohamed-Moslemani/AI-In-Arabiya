import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSave, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const handleAxiosError = useCallback(
    (err) => {
      let message = "خطأ في تحميل البيانات.";
      if (err?.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          message = err.response.data.detail.map((e) => e.msg || JSON.stringify(e)).join(" | ");
        } else if (typeof err.response.data.detail === "object") {
          message = JSON.stringify(err.response.data.detail);
        } else {
          message = err.response.data.detail;
        }
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("الجلسة انتهت. يرجى تسجيل الدخول مرة أخرى");
        navigate("/login");
      } else if (err.response?.status === 400) {
        toast.error(message || "خطأ في البيانات المدخلة.");
      } else if (err.response?.status >= 500) {
        setError("خطأ في الخادم. حاول مرة أخرى لاحقًا.");
      } else {
        setError(message);
      }
    },
    [navigate]
  );

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
        setEditData(response.data.profile);
      } catch (err) {
        handleAxiosError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, handleAxiosError]);

  const handleInputChange = (key, value) => {
    setEditData({ ...editData, [key]: value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.put("http://localhost:8000/auth/profile", editData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserData(editData);
      setIsEditing(false);
      toast.success("تم حفظ التعديلات بنجاح!");
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsAvatarUploading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.put(
        "http://localhost:8000/auth/profile/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData({ ...userData, avatar_url: response.data.avatar_url });
      toast.success("تم تحديث الصورة الشخصية بنجاح!");
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-blue-600 animate-pulse">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500">لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  const personalInfo = [
    { label: "الاسم", key: "name" },
    { label: "العمر", key: "age" },
    { label: "البريد الإلكتروني", key: "email" },
    { label: "رقم الهاتف", key: "phone_number" },
    { label: "الجنس", key: "gender" },
    { label: "تاريخ الميلاد", key: "date_of_birth" },
    { label: "الدولة", key: "country" },
    { label: "المدينة", key: "city" },
  ];

  const additionalInfo = [
    { label: "المستوى الدراسي", key: "study_level" },
    { label: "المهارات البرمجية", key: "programming_skills" },
    { label: "الاهتمامات", key: "interests" },
    { label: "أسلوب التعلم المفضل", key: "preferred_learning_style" },
    { label: "الروتين اليومي", key: "daily_routine" },
    { label: "الأهداف", key: "goals" },
    { label: "التحديات", key: "challenges" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group"
            onMouseEnter={() => setShowChangePhoto(true)}
            onMouseLeave={() => setShowChangePhoto(false)}
          >
            {isAvatarUploading ? (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <FaSpinner className="text-white animate-spin text-3xl" />
              </div>
            ) : (
              <img
                src={userData?.avatar_url || "../assets/images/placeholder.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
            {!isAvatarUploading && showChangePhoto && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <label
                  htmlFor="avatarInput"
                  className="text-white font-semibold cursor-pointer"
                >
                  تغيير الصورة
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            مرحبا {userData.name || ""}!
          </h1>
          <p className="text-gray-700 text-sm md:text-base">
            هنا يمكنك مراجعة وتعديل معلوماتك الشخصية.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
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
        {selectedTab === "personal" && (
          <ProfileSection
            title="المعلومات الشخصية"
            items={personalInfo}
            isEditing={isEditing}
            editData={editData}
            handleInputChange={handleInputChange}
          />
        )}
        {selectedTab === "additional" && (
          <ProfileSection
            title="المزيد من المعلومات"
            items={additionalInfo}
            isEditing={isEditing}
            editData={editData}
            handleInputChange={handleInputChange}
          />
        )}
        <div className="flex justify-center mt-10">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaSave /> حفظ التعديلات
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaUserEdit /> تعديل الملف الشخصي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({
  title,
  items,
  isEditing,
  editData,
  handleInputChange,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition max-w-3xl mx-auto">
    <div className="flex items-center gap-2 mb-4 border-b border-blue-100 pb-2">
      <h2 className="text-2xl font-semibold text-blue-700">{title}</h2>
    </div>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
        >
          <span className="text-gray-700 font-medium">{item.label}:</span>
          {isEditing ? (
            <input
              type="text"
              value={editData[item.key] || ""}
              onChange={(e) => handleInputChange(item.key, e.target.value)}
              className="border rounded-md px-2 py-1 text-blue-700"
            />
          ) : (
            <span className="text-blue-700 font-semibold">
              {editData[item.key] || "غير متوفر"}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Profile;

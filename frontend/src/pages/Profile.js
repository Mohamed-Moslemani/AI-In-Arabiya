import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSave, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const programmingSkillsOptions = [
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "Hugging Face",
  "OpenCV",
  "Spacy",
  "NLTK",
  "Apache Spark MLlib",
  "H2O.ai",
  "ONNX",
  "MXNet",
  "LightGBM",
  "XGBoost",
  "CatBoost",
  "RapidMiner",
  "MATLAB",
  "IBM Watson",
  "Google Cloud AI",
  "AWS SageMaker",
  "Azure Machine Learning",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "TypeScript",
  "Node.js",
  "React",
  "Angular",
  "Vue.js",
  "Django",
  "Flask",
  "Laravel",
  "Ruby on Rails",
  "Spring Boot",
  ".NET",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "Git",
];

// البلدان العربية الـ 22 مع أعلامها كأمثلة
const arabCountries = [
  { value: "السعودية", label: "السعودية 🇸🇦" },
  { value: "الإمارات", label: "الإمارات 🇦🇪" },
  { value: "الكويت", label: "الكويت 🇰🇼" },
  { value: "قطر", label: "قطر 🇶🇦" },
  { value: "البحرين", label: "البحرين 🇧🇭" },
  { value: "عمان", label: "عمان 🇴🇲" },
  { value: "مصر", label: "مصر 🇪🇬" },
  { value: "المغرب", label: "المغرب 🇲🇦" },
  { value: "الجزائر", label: "الجزائر 🇩🇿" },
  { value: "تونس", label: "تونس 🇹🇳" },
  { value: "ليبيا", label: "ليبيا 🇱🇾" },
  { value: "السودان", label: "السودان 🇸🇩" },
  { value: "الأردن", label: "الأردن 🇯🇴" },
  { value: "لبنان", label: "لبنان 🇱🇧" },
  { value: "سوريا", label: "سوريا 🇸🇾" },
  { value: "العراق", label: "العراق 🇮🇶" },
  { value: "اليمن", label: "اليمن 🇾🇪" },
  { value: "فلسطين", label: "فلسطين 🇵🇸" },
  { value: "الصومال", label: "الصومال 🇸🇴" },
  { value: "موريتانيا", label: "موريتانيا 🇲🇷" },
  { value: "جيبوتي", label: "جيبوتي 🇩🇯" },
  { value: "جزر القمر", label: "جزر القمر 🇰🇲" },
];

const learningStyles = [
  { value: "سمعي", label: "سمعي" },
  { value: "بصري", label: "بصري" },
  { value: "حسي حركي", label: "حسي حركي" },
  { value: "قرائي", label: "قرائي" },
];

const studyLevels = [
  { value: "لا أدرس حاليا", label: "لا أدرس حاليا" },
  { value: "مدرسة", label: "مدرسة" },
  { value: "جامعة", label: "جامعة" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
];

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
          message = err.response.data.detail
            .map((e) => e.msg || JSON.stringify(e))
            .join(" | ");
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
    { label: "الاسم", key: "name", type: "text" },
    {
      label: "البريد الإلكتروني",
      key: "email",
      type: "email",
      editable: false, 
    },
    {
      label: "رقم الهاتف",
      key: "phone_number",
      type: "text",
      editable: false, 
    },
    {
      label: "الجنس",
      key: "gender",
      type: "select",
      options: [
        { value: "ذكر", label: "ذكر" },
        { value: "أنثى", label: "أنثى" },
      ],
    },
    {
      label: "تاريخ الميلاد",
      key: "date_of_birth",
      type: "date",
    },
    {
      label: "الدولة",
      key: "country",
      type: "select",
      options: arabCountries, 
    },
    { label: "المدينة", key: "city", type: "text" },
  ];

  const additionalInfo = [
    {
      label: "المستوى الدراسي",
      key: "study_level",
      type: "select",
      options: studyLevels,
    },
    {
      label: "المهارات البرمجية",
      key: "programming_skills",
      type: "multiselect",
      options: programmingSkillsOptions,
    },
    { label: "الاهتمامات", key: "interests", type: "text" },
    {
      label: "أسلوب التعلم المفضل",
      key: "preferred_learning_style",
      type: "select",
      options: learningStyles,
    },
    { label: "الأهداف", key: "goals", type: "text" },
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
}) => {
  // دالة لمساعدة اختيار/إلغاء اختيار المهارات
  const handleSkillToggle = (skill) => {
    const currentSkills = Array.isArray(editData.programming_skills)
      ? editData.programming_skills
      : [];
    if (currentSkills.includes(skill)) {
      // إزالة المهارة إن كانت محددة
      handleInputChange(
        "programming_skills",
        currentSkills.filter((s) => s !== skill)
      );
    } else {
      // إضافتها إن لم تكن موجودة
      handleInputChange("programming_skills", [...currentSkills, skill]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4 border-b border-blue-100 pb-2">
        <h2 className="text-2xl font-semibold text-blue-700">{title}</h2>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => {
          if (!isEditing || item.editable === false) {
            if (item.type === "multiselect") {
              const skills = Array.isArray(editData[item.key])
                ? editData[item.key]
                : [];
              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
                >
                  <span className="text-gray-700 font-medium mb-1 md:mb-0">
                    {item.label}:
                  </span>
                  <span className="text-blue-700 font-semibold">
                    {skills.length
                      ? skills.join(", ")
                      : "لم يتم اختيار مهارات بعد"}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
              >
                <span className="text-gray-700 font-medium mb-1 md:mb-0">
                  {item.label}:
                </span>
                {/* إذا كان تاريخ ميلاد و موجودة قيمة، نظهرها بصيغة نصية مناسبة */}
                {item.type === "date" && editData[item.key] ? (
                  <span className="text-blue-700 font-semibold">
                    {new Date(editData[item.key]).toLocaleDateString("en-GB")}
                  </span>
                ) : (
                  <span className="text-blue-700 font-semibold">
                    {editData[item.key] || "غير متوفر"}
                  </span>
                )}
              </div>
            );
          }

          switch (item.type) {
            case "text":
              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
                >
                  <span className="text-gray-700 font-medium mb-1 md:mb-0">
                    {item.label}:
                  </span>
                  <input
                    type="text"
                    value={editData[item.key] || ""}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    className="border rounded-md px-2 py-1 text-blue-700"
                  />
                </div>
              );
            case "email":
              return null;
            case "select":
              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
                >
                  <span className="text-gray-700 font-medium mb-1 md:mb-0">
                    {item.label}:
                  </span>
                  <select
                    value={editData[item.key] || ""}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    className="border rounded-md px-2 py-1 text-blue-700"
                  >
                    <option value="">اختر من القائمة</option>
                    {item.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "date":
              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
                >
                  <span className="text-gray-700 font-medium mb-1 md:mb-0">
                    {item.label}:
                  </span>
                  <DatePicker
                    selected={
                      editData[item.key] ? new Date(editData[item.key]) : null
                    }
                    onChange={(date) => handleInputChange(item.key, date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="اختر تاريخ الميلاد"
                    className="border rounded-md px-2 py-1 text-blue-700"
                  />
                </div>
              );
              case "multiselect":
                // Chips-style toggle
                return (
                  <div
                    key={idx}
                    className="bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 transition"
                  >
                    <span className="text-gray-700 font-medium">
                      {item.label}:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.options.map((skill) => {
                        const currentSkills = Array.isArray(editData[item.key])
                          ? editData[item.key]
                          : [];
                        const isSelected = currentSkills.includes(skill);
              
                        return (
                          <span
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-3 py-1 rounded-full cursor-pointer transition
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }
                            `}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default Profile;
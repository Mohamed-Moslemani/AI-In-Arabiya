import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await axios.put(
        "http://localhost:8000/auth/profile",
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccess("تم تحديث الملف الشخصي بنجاح");
    } catch (err) {
      setError("حدث خطأ أثناء تحديث البيانات.");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">تعديل الملف الشخصي</h1>
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Immutable Fields */}
          <div>
            <label className="block text-gray-700">البريد الإلكتروني:</label>
            <input
              type="email"
              value={userData.email || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">الاسم:</label>
            <input
              type="text"
              value={userData.name || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>
          {/* Editable Fields */}
          <div>
            <label className="block text-gray-700">رقم الهاتف:</label>
            <input
              type="text"
              name="phone_number"
              value={userData.phone_number || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">العمر:</label>
            <input
              type="number"
              name="age"
              value={userData.age || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">المدينة:</label>
            <input
              type="text"
              name="city"
              value={userData.city || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Add other editable fields as needed */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              تحديث
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import React, { useState } from "react";
import axios from "axios";
import SignupImage from "../assets/images/bg.png";
import EyeOpenIcon from "../assets/images/eyeopen.svg";
import EyeCloseIcon from "../assets/images/eyeclose.svg";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    study_level: "",
    date_of_birth: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const symbolCheck = /[@$!%*?&]/.test(password);

    setPasswordChecks({
      length: lengthCheck,
      uppercase: uppercaseCheck,
      number: numberCheck,
      symbol: symbolCheck,
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("كلمات المرور غير متطابقة.");
      return;
    }

    const allValid = Object.values(passwordChecks).every((check) => check);
    if (!allValid) {
      alert("كلمة المرور لا تلبي المتطلبات.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-0 pb-0">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">إنشاء حساب جديد</h2>
        <form
          onSubmit={handleSignup}
          className="space-y-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-blue-700 text-sm font-bold mb-2">الاسم:</label>
              <input
                type="text"
                placeholder="أدخل اسمك"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-blue-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
              />
            </div>

            {/* Study Level */}
            <div>
              <label className="block text-blue-700 text-sm font-bold mb-2">المستوى الدراسي:</label>
              <input
                type="text"
                placeholder="مثال: طالب جامعي"
                value={formData.study_level}
                onChange={(e) => setFormData({ ...formData, study_level: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-blue-700 text-sm font-bold mb-2">تاريخ الميلاد:</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-blue-700 text-sm font-bold mb-2">رقم الهاتف:</label>
              <input
                type="tel"
                placeholder="أدخل رقم هاتفك"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">كلمة المرور:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-400 transition duration-300 relative">
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="px-4 py-2 focus:outline-none bg-white"
              >
                <img
                  src={isPasswordVisible ? EyeOpenIcon : EyeCloseIcon}
                  alt="Toggle visibility"
                  className="w-6 h-6 bg-white"
                />
              </button>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 focus:outline-none bg-transparent"
              />
            </div>
            <div className="mt-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      passwordChecks.length ? "bg-green-500" : "bg-red-500"
                    } text-white text-xs`}
                  >
                    {passwordChecks.length ? "✓" : "✗"}
                  </span>
                  <span className="ml-3 pr-1 text-gray-700">ثمانية أحرف على الأقل</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      passwordChecks.uppercase ? "bg-green-500" : "bg-red-500"
                    } text-white text-xs`}
                  >
                    {passwordChecks.uppercase ? "✓" : "✗"}
                  </span>
                  <span className="ml-3 pr-1 text-gray-700">حرف كبير واحد على الأقل</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      passwordChecks.number ? "bg-green-500" : "bg-red-500"
                    } text-white text-xs`}
                  >
                    {passwordChecks.number ? "✓ " : "✗ "}
                  </span>
                  <span className="ml-3 pr-1 text-gray-700">رقم واحد على الأقل</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      passwordChecks.symbol ? "bg-green-500" : "bg-red-500"
                    } text-white text-xs`}
                  >
                    {passwordChecks.symbol ? "✓" : "✗"}
                  </span>
                  <span className="ml-3 pr-1 text-gray-700">رمز واحد على الأقل (@$!%*?&)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">تأكيد كلمة المرور:</label>
            <input
              type="password"
              placeholder="أعد إدخال كلمة المرور"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition duration-300 ${
              Object.values(passwordChecks).every((check) => check)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!Object.values(passwordChecks).every((check) => check)}
          >
            إنشاء حساب
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
      <img src={SignupImage} alt="Signup Illustration" className="w-3/4 h-auto" />
      </div>
    </div>
  );
};

export default Signup;

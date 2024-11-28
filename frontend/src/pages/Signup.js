import React, { useState } from 'react';
import axios from 'axios';
import SignupImage from '../assets/images/bg.png'; 
import EyeOpenIcon from '../assets/images/eyeopen.svg'
import EyeCloseIcon from '../assets/images/eyeclose.svg'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/signup', formData);
      console.log('Signup successful:', response.data);
      // Handle signup success (redirect to login, etc.)
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-12 py-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">إنشاء حساب جديد</h2>
        <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto">
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
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">العمر:</label>
            <input
              type="number"
              placeholder="أدخل عمرك"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition duration-300"
            />
          </div>
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
          <div className="relative">
            <label className="block text-blue-700 text-sm font-bold mb-2">كلمة المرور:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-blue-400 transition duration-300">
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="px-4 py-2 text-blue-600 focus:outline-none"
              >
                <img
                  src={isPasswordVisible ? EyeOpenIcon : EyeCloseIcon}
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 focus:outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
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

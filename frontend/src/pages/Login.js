import React, { useState } from 'react';
import axios from 'axios';
import LoginImage from '../assets/images/bg.png'; 
import EyeOpenIcon from '../assets/images/eyeopen.svg'; 
import EyeCloseIcon from '../assets/images/eyeclose.svg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      // Handle login success (store token, redirect, etc.)
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-12 py-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">تسجيل الدخول</h2>
        <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 focus:outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* Button for first-time visitors */}
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-700">
            أول مرة تزورنا؟{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              قم بالتسجيل في حساب جديد
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
        <img src={LoginImage} alt="Login Illustration" className="w-3/4 h-auto" />
      </div>
    </div>
  );
};

export default Login;

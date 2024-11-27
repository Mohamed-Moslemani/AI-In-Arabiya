import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      });
      console.log('Login successful:', response.data);
      // Handle login success (store token, redirect, etc.)
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>كلمة المرور:</label>
        <input
          type="password"
          placeholder="أدخل كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: ''
  });

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
    <div className="signup">
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleSignup}>
        <label>الاسم:</label>
        <input
          type="text"
          placeholder="أدخل اسمك"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <label>العمر:</label>
        <input
          type="number"
          placeholder="أدخل عمرك"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <label>كلمة المرور:</label>
        <input
          type="password"
          placeholder="أدخل كلمة المرور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">إنشاء حساب</button>
      </form>
    </div>
  );
};

export default Signup;

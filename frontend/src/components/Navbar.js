import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">الصفحة الرئيسية</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/login">تسجيل الدخول</Link></li>
        <li><Link to="/signup">التسجيل</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

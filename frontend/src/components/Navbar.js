import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white font-bold text-2xl hover:text-blue-200 transition duration-300"
            >
              ذكاء+
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/signup"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    التسجيل
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    لوحة القيادة
                  </Link>
                  <Link
                    to="/algorithms"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    محاكاة الخوارزميات
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    تسجيل الخروج
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;

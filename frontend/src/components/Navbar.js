import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-2xl hover:text-blue-200 transition duration-300">
                ذكاء+
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                الصفحة الرئيسية
              </Link>
              <Link to="/login" className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                تسجيل الدخول
              </Link>
              <Link to="/signup" className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                التسجيل
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={toggleMenu}
              type="button" 
              className="bg-blue-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500">
            <Link to="/" className="text-white block hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              الصفحة الرئيسية
            </Link>
            <Link to="/login" className="text-white block hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              تسجيل الدخول
            </Link>
            <Link to="/signup" className="text-white block hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-base font-medium">
              التسجيل
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
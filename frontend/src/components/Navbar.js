import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-white font-bold text-3xl hover:text-blue-200 transition duration-300"
          >
            خوارزمياتك
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
          
            <Link
              to="/dashboard"
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg"
            >
              لوحة القيادة
            </Link>
            <Link
              to="/algorithms"
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg"
            >
              محاكاة الخوارزميات
            </Link>
            <Link
              to="/notes"
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              أسئلة وأجوبة
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-2xl hover:text-blue-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-400 px-4 pb-4">
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              لوحة القيادة
            </Link>
            <Link
              to="/algorithms"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              محاكاة الخوارزميات
            </Link>
            <Link
              to="/notes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              أسئلة وأجوبة
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

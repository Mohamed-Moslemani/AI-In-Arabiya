import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">خوارزمياتك</h3>
            <p className="text-sm text-blue-100">
لأننا نؤمن بأن الذكاء الإصطناعي حق لكل فرد في مجتمعنا
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-200 transition duration-300">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/Panels" className="hover:text-blue-200 transition duration-300">
محاكاة الخوارزميات
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-200 transition duration-300">
                  التسجيل
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li>البريد الإلكتروني: info@aibilarabi.com</li>
              <li>الهاتف: +966 11 234 5678</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-blue-200 transition duration-300"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 transition duration-300"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-500 text-center">
          <p className="text-sm text-blue-100">
            &copy; 2024 AI بالعربية. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

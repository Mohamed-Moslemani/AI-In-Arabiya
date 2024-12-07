import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Importing useNavigate inside the component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AlgorithmsPage from "./pages/Panels"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Now calling the hook inside the functional component

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUserData(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem("access_token", token);
    setUserData(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserData(null);
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Signup onSignup={handleLogin} />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isLoggedIn ? (
                  <Profile userData={userData} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/algorithms" element={<AlgorithmsPage />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

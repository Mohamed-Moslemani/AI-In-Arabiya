import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AlgorithmsPage from "./pages/Panels";
import LinearRegressionPage from "./pages/LinearRegression"; 
import LogisticRegressionPage from "./pages/LogisticRegression"
import SVMPage from "./pages/svms";
import DecisionTreePage from "./pages/decisiontree";
import Notes from "./pages/Notes";
import AIMathematics from "./pages/AIMathematics";
import AIApplications from "./pages/AIApplications";
import WhatIsAI from "./pages/WhatIdAI.js";
import AIAlgorithms from "./pages/AIAlgorithms";

// Create a wrapper component to handle navigation
function AppRoutes({ isLoggedIn, userData, handleLogin, handleLogout }) {
  const navigate = useNavigate();

  const wrappedHandleLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={wrappedHandleLogout} />
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
          <Route path="/simulate/linear-regression" element={<LinearRegressionPage />} />
          <Route path="/simulate/logistic-regression" element={<LogisticRegressionPage />} />
          <Route path="/simulate/svm" element={<SVMPage />} />
          <Route path="/simulate/decision-tree" element={<DecisionTreePage />} />
          <Route path="/notes" element={<Notes />} />
 

        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppRoutes 
          isLoggedIn={isLoggedIn}
          userData={userData}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </div>
    </Router>
  );
}

export default App;
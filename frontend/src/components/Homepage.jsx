import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="homepage">
      <button className="auth-button" onClick={handleButtonClick}>
        {isAuthenticated ? "Dashboard" : "Login/Signup"}
      </button>
      <h1 className="animated-text">Welcome to Study Notion</h1>
    </div>
  );
};

export default Homepage;

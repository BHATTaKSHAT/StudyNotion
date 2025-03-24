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
      <div className="nav-header">
        <div className="logo">
          <span className="logo-text">StudyNotion</span>
        </div>
        <button className="auth-button" onClick={handleButtonClick}>
          {isAuthenticated ? "Dashboard" : "Login/Signup"}
        </button>
      </div>

      <div className="hero-section">
        <h1 className="animated-text">Welcome to Study Notion</h1>
        <p className="hero-subtitle">
          YOUR <span className="highlight">GATEWAY</span> <br></br>
          TO<br></br>
          INTERACTIVE <span className="blue">LEARNING</span>
        </p>
        <div className="features">
          <div className="feature-card  icon-book">
            <span className="feature-icon">📚</span>
            <h3>Rich Content</h3>
            <p>Access comprehensive courses with video lectures and articles</p>
          </div>
          <div className="feature-card  icon-quiz">
            <span className="feature-icon">✍️</span>
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge with engaging quizzes</p>
          </div>
          <div className="feature-card icon-progress">
            <span className="feature-icon">📊</span>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed progress tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

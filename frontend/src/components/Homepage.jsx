import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import pencilImage from "../assets/pencil.png";
import book from "../assets/book.png";
import prplball from "../assets/prplball.png";
import earth from "../assets/earth.png";
import tag from "../assets/tag.png";

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

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "-" || e.key === "=") {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <img src={pencilImage} alt="pencil" className="pencil-image" />
        <img src={book} alt="book" className="book-image" />
        <img src={prplball} alt="prplball" className="prplball-image" />
        <img src={earth} alt="earth" className="earth-image" />
        <img src={tag} alt="tag" className="tag-image" />
        <p className="hero-subtitle">
          CREATE NEW<br></br>
          <span className="highlight">EXPERIENCE</span> WITH <br></br>
          <span className="outline">WAYS OF</span>
          <br></br>
          PERFECT <span className="blue">LEARNING</span>
        </p>
      </div>
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
        {/* <h2 className="features-subtitle">
            ENHANCE YOUR <br></br>
            WITH ENGAGING LEARNING TOOLS
          </h2> */}
      </div>
    </div>
  );
};

export default Homepage;

import React, {useState} from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./Homepage.css";
import pencilImage from "../assets/pencil.png";
import book from "../assets/book.png";
import prplball from "../assets/prplball.png";
import earth from "../assets/earth.png";
import tag from "../assets/tag.png";
import hat from "../assets/hat.png";
import camera from "../assets/camera.png";
import progress from "../assets/progress.png";
import easy from "../assets/easy.png";
import education from "../assets/education.png";
import card from "../assets/card.png";
import studynotionlogo from "../assets/studynotionlogo.png";
import studynotionlogocolor from "../assets/studynotionlogocolor.png";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

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

  const tabs = [
    {
      title: "Resume Learning",
      heading: "Resume Where You Left Off",
      content:
        "Never lose your spot again! Our platform automatically remembers your progress in each lesson and video, allowing you to pick exactly where you left off.",
      image: card,
    },
    {
      title: "Earn Certificates",
      heading: "Achieve and Get Certified",
      content:
        "Complete courses and earn digital certificates to showcase your knowledge. Whether for your resume or personal satisfaction, our certificates reflect your hard work and success.",
      image: hat,
    },
    {
      title: "Track Progress",
      heading: "Track Your Learning Journey",
      content:
        "Stay on top of your progress with detailed insights after every lesson. Our smart tracking helps you monitor what you've completed, what’s pending, and how far you’ve come in each course.",
      image: progress,
    },
  ];

  return (
    <div className="homepage">
      <div className="nav-header">
        <div className="nav-links">
          <NavLink
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="nav-link"
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </NavLink>
          <NavLink to="/courses" className="nav-link">
            Courses
          </NavLink>
          <NavLink to="/" className="logo-link">
            <span className="logo-text">
              <img src={studynotionlogo} />
            </span>
          </NavLink>
          <NavLink to="/" className="nav-link">
            Blog
          </NavLink>
          <NavLink to="/" className="nav-link">
            Contact Us
          </NavLink>
        </div>
      </div>

      <div className="hero-section">
        <h1 className="animated-text">Welcome to Study Notion</h1>
        {/* <img src={pencilImage} alt="pencil" className="pencil-image" />
        <img src={book} alt="book" className="book-image" />
        <img src={prplball} alt="prplball" className="prplball-image" />
        <img src={earth} alt="earth" className="earth-image" />
        <img src={tag} alt="tag" className="tag-image" /> */}
        <p className="hero-subtitle">
          CREATE NEW<br></br>
          <span className="highlight">EXPERIENCE</span> WITH <br></br>
          <span className="outline">WAYS OF</span>
          <br></br>
          PERFECT <span className="blue">LEARNING</span>
        </p>
      </div>
      <div className="features">
        <h1>
          DISCOVER SMART TOOLS THAT<br></br>EMPOWER YOUR
        </h1>
        <div className="feature-cards">
          <div className="feature-card  icon-book">
            <img src={camera} className="feature-icon" />
            <h2>Resume Learning</h2>
            <p>
              Pick up exactly where you left off with our smart video resume
              feature - never lose track again.
            </p>
          </div>
          <div className="feature-card  icon-quiz">
            <span className="feature-icon">
              <img src={hat} />
            </span>
            <h2>Earn Certificates</h2>
            <p>
              Stay motivated by tracking your learning journey and unlock
              certificates as you grow.
            </p>
          </div>
          <div className="feature-card icon-progress">
            <span className="feature-icon">
              <img src={progress} />
            </span>
            <h2>Track Progress</h2>
            <p>
              Monitor your lesson completion and move confidently toward your
              learning goals.
            </p>
          </div>
        </div>
      </div>
      <div className="moving-cards">
        <h1>
          OUR PROGRAM IS <img src={easy} />
          TO USE <br /> AND USEFUL FOR THE FUTURE
        </h1>
        <div className="tab-buttons">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="tab-card" data-tab={activeTab}>
          <div className="tab-card-content">
            <h2>{tabs[activeTab].heading}</h2>
            <p>{tabs[activeTab].content}</p>
          </div>
          <img
            src={tabs[activeTab].image}
            alt={tabs[activeTab].title}
            className="tab-icon"
          />
        </div>
      </div>
      <div className="faq-section">
        <h1 className="faq-heading">Frequently Asked Questions</h1>
        {[
          {
            question: "What is Study Notion?",
            answer:
              "Study Notion is an online learning platform that provides courses, quizzes, and progress tracking to help you achieve your learning goals.",
          },
          {
            question: "How can I track my progress?",
            answer:
              "Our platform offers detailed progress tracking for each course, allowing you to monitor completed lessons, pending tasks, and overall progress.",
          },
          {
            question: "Do I get certificates after completing courses?",
            answer:
              "Yes, you will receive digital certificates upon completing courses, which you can showcase on your resume or LinkedIn profile.",
          },
          {
            question: "Is there a free trial available?",
            answer: "Yes, StudyNotion is totally free for all users.",
          },
        ].map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeFaq === index ? "active" : ""}`}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              <h2>{faq.question}</h2>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <p className="footer-subtitle">
          <span className="pink-highlight">LET'S</span> UNLOCK
          <br />
          YOUR POTENTIAL
          <br />
          WITH <span className="sn">STUDYNOTION</span>
        </p>
        <div className="footer-logo">
          <img src={studynotionlogocolor} alt="StudyNotion Logo" />
          <p>Copyright @StudyNotion 2025 All Rights Reserved</p>
          <div className="social-icons">
            <Facebook className="social-icon" />
            <Instagram className="social-icon" />
            <Twitter className="social-icon" />
            <Youtube className="social-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/progress", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res) => setProgress(res.data))
        .catch((err) => console.error(err));
    }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleResumeClick = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/progress/resume/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resumePoint = response.data;

      if (resumePoint.type === "lesson") {
        navigate(`/course/${courseId}?lesson=${resumePoint.index}`);
      } else if (resumePoint.type === "quiz") {
        navigate(`/course/${courseId}?quiz=${resumePoint.index}`);
      }
    } catch (error) {
      console.error("Error fetching resume point:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getProgressForCourse = (courseId) => {
    const courseProgress = progress.find((p) => p.courseId._id === courseId);
    if (!courseProgress) return "0%";

    const courseData = courses.find((c) => c._id === courseId);
    if (!courseData) return "0%";

    // Total lessons in the course
    const totalLessons = courseData.lessons.length;

    // Total quizzes present across lessons
    const totalQuizzes = courseData.lessons.filter(
      (lesson) => lesson.quiz
    ).length;

    // Total items (lessons + quizzes)
    const totalItems = totalLessons + totalQuizzes;

    // Completed items (lessons + quizzes)
    const completedItems =
      courseProgress.completedLessons.length +
      courseProgress.completedQuizzes.length;

    // Calculate progress percentage
    return `${Math.round((completedItems / totalItems) * 100)}%`;
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="welcome-container">
          <h2 className="welcome-text">
            <span className="italic">Welcome back,</span>
            <span className="bold">{username}</span>
          </h2>
          <p className="subtitle">Continue your learning journey</p>
        </div>
        <button className="logout" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>

      <section className="courses-section">
        <h2 className="section-title">My Courses</h2>
        <div className="course-list">
          {courses
            .filter((course) => getProgressForCourse(course._id) !== "0%")
            .map((course) => (
              <div
                className="course-card"
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: getProgressForCourse(course._id),
                      }}
                    ></div>
                    <span className="progress-text">
                      Progress: {getProgressForCourse(course._id)}
                    </span>
                  </div>
                </div>
                <button
                  className="resume-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResumeClick(course._id);
                  }}
                >
                  <span className="resume-icon">▶️</span>
                  Resume
                </button>
              </div>
            ))}
        </div>
      </section>

      <section className="courses-section">
        <h2 className="section-title">Available Courses</h2>
        <div className="course-list">
          {courses
            .filter((course) => getProgressForCourse(course._id) === "0%")
            .map((course) => (
              <div
                className="course-card new-course"
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-status">New Course</p>
                </div>
                <button className="start-button">
                  <span className="start-icon">🎯</span>
                  Start Learning
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

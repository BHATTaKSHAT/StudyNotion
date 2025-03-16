import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2 className="welcome-text">
          <span className="italic">Welcome, </span>
          <span className="bold">{username}</span>
        </h2>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2>Available Courses</h2>
      <div className="course-list">
        {courses.map((course) => (
          <div
            className="course-card"
            key={course._id}
            onClick={() => handleCourseClick(course._id)}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

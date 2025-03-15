import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch courses on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCourseClick = (courseId) => {
    // Navigate to a page that shows course details and lessons explorer
    navigate(`/course/${courseId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
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
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

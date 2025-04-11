import React, { useState } from "react";
import "./CoursePage.css";

const CoursePage = ({ courses }) => {
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const handleViewMore = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div className="course-page">
      <h1 className="page-title">Available Courses</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <div
            key={course._id}
            className={`course-card ${
              expandedCourseId === course._id ? "expanded" : ""
            }`}
          >
            <img
              src={`http://localhost:5000/logos/${course.logo}`}
              alt={`${course.title} Logo`}
              className="course-logo"
            />
            <h3 className="course-page-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <button
              className="view-more-button"
              onClick={() => handleViewMore(course._id)}
            >
              {expandedCourseId === course._id ? "View Less" : "View More"}
            </button>
            {expandedCourseId === course._id && (
              <div className="course-details">
                <h4>Lessons</h4>
                <ul>
                  {course.lessons.map((lesson, index) => (
                    <li key={index}>
                      {lesson.title}
                      {lesson.quiz && <span> (Quiz Available)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;

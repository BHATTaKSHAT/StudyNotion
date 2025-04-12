import React, { useState } from "react";
import styles from "./CoursePage.module.css"; // Import the CSS module
import "./Dashboard.css"; // Import Dashboard.css for shared styles

const CoursePage = ({ courses }) => {
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const handleViewMore = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div className={styles["course-page"]}>
      <h1 className={styles["page-title"]}>Available Courses</h1>
      <div className={styles["course-grid"]}>
        {courses.map((course) => (
          <div
            key={course._id}
            className={`${styles["course-card"]} ${
              expandedCourseId === course._id ? styles["expanded"] : ""
            }`}
          >
            <img
              src={`http://localhost:5000/logos/${course.logo}`}
              alt={`${course.title} Logo`}
              className={styles["course-logo"]}
            />
            <h3 className={styles["course-page-title"]}>{course.title}</h3>
            <p className={styles["course-description"]}>{course.description}</p>
            <button
              className={styles["view-more-button"]}
              onClick={() => handleViewMore(course._id)}
            >
              {expandedCourseId === course._id ? "View Less" : "View More"}
            </button>
            {expandedCourseId === course._id && (
              <div className={styles["course-details"]}>
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

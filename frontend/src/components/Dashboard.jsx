import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { X } from "lucide-react";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [username, setUsername] = useState("");
  // New state variables for pagination (visible count)
  const [myCoursesVisibleCount, setMyCoursesVisibleCount] = useState(3);
  const [availableCoursesVisibleCount, setAvailableCoursesVisibleCount] =
    useState(3);
  // New state for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

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

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfilePicture(response.data.profilePicture);
      } catch (err) {
        console.error("Error fetching profile picture:", err);
      }
    };

    fetchProfilePicture();
  }, []);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const [isUploading, setIsUploading] = useState(false);

  <input
    type="file"
    id="fileInput"
    style={{ display: "none" }}
    onChange={async (e) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", e.target.files[0]);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/profile-picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfilePicture(`${response.data.profilePicture}?t=${Date.now()}`);
      } catch (err) {
        console.error("Error uploading profile picture:", err);
      } finally {
        setIsUploading(false);
      }
    }}
  />;
  {
    isUploading && <p>Uploading...</p>;
  }

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/delete",
        { password: passwordInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setDeleteError("Incorrect password. Please try again.");
      } else {
        console.error("Error deleting account:", err);
        setDeleteError("Something went wrong. Please try again.");
      }
    }
  };

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

    // Total quizzes across lessons
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const stopWords = new Set(["in", "on", "the", "and", "a", "of", "to"]);
    const queryTokens = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => !stopWords.has(token));
    const results = [];

    courses.forEach((course) => {
      const courseTitle = course.title.toLowerCase();
      const courseDescription = course.description.toLowerCase();

      // Check if any token matches the course title or description
      const courseMatches = queryTokens.every(
        (token) =>
          courseTitle.includes(token) || courseDescription.includes(token)
      );

      if (courseMatches) {
        results.push({
          courseId: course._id,
          courseTitle: course.title,
          lessonIndex: 0,
          lessonTitle: null,
          isCourseOnly: true,
        });
      }

      // Check lessons within the course
      course.lessons.forEach((lesson, idx) => {
        const lessonTitle = lesson.title.toLowerCase();
        const lessonArticle = lesson.article?.toLowerCase() || "";

        const lessonMatches = queryTokens.every(
          (token) =>
            lessonTitle.includes(token) || lessonArticle.includes(token)
        );

        if (lessonMatches) {
          results.push({
            courseId: course._id,
            courseTitle: course.title,
            lessonIndex: idx,
            lessonTitle: lesson.title,
            isCourseOnly: false,
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchQuery, courses]);

  const handleSearchSelect = (result) => {
    navigate(`/course/${result.courseId}?lesson=${result.lessonIndex}`);
    // Clear search when a result is selected
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]); // Close search results
      }

      if (isProfileMenuOpen && !event.target.closest(".profile-container")) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Filter courses into My Courses and Available Courses sections
  const myCourses = courses.filter(
    (course) => getProgressForCourse(course._id) !== "0%"
  );
  const availableCourses = courses.filter(
    (course) => getProgressForCourse(course._id) === "0%"
  );

  return (
    <div className="dashboard">
      <div className="header">
        <div className="welcome-container">
          <h2 className="welcome-text">
            <span className="italic">Welcome back, </span>
            <span className="bold">{username}</span>
          </h2>
          <p className="subtitle">Continue your learning journey</p>
          {/* Search input under welcome container */}
          <div className="search-container" ref={searchContainerRef}>
            <input
              type="text"
              placeholder="Search courses and lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <X size={20} />
              </button>
            )}
            {searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className="search-results-card">
                <div className="search-result-item">
                  No results found for "{searchQuery}"
                </div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="search-results-card">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSearchSelect(result)}
                  >
                    <strong>{result.courseTitle}</strong>
                    {!result.isCourseOnly && ` - ${result.lessonTitle}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <button className="logout" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button> */}
        <div className="profile-container">
          <div className="profile-icon" onClick={handleProfileMenuToggle}>
            {profilePicture ? (
              <img
                src={`http://localhost:5000${profilePicture}`}
                alt="Profile"
                className="profile-pic"
              />
            ) : (
              <span className="profile-initial">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {isProfileMenuOpen && (
            <div className="profile-menu">
              <button
                onClick={() => document.getElementById("fileInput").click()}
              >
                {profilePicture
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"}
              </button>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const formData = new FormData();
                  formData.append("profilePicture", e.target.files[0]);
                  const token = localStorage.getItem("token");
                  try {
                    const response = await axios.post(
                      "http://localhost:5000/api/users/profile-picture",
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    setProfilePicture(response.data.profilePicture);
                  } catch (err) {
                    console.error("Error uploading profile picture:", err);
                  }
                }}
              />
              <button onClick={handleLogout}>Logout</button>
              <button
                className="delete-account-button"
                onClick={() => setIsDeletePopupOpen(true)}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>

      {isDeletePopupOpen && (
        <div className="delete-popup-overlay">
          <div className="delete-popup-card">
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <input
              type="password"
              placeholder="Enter your password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="delete-popup-input"
            />
            {deleteError && <p className="delete-popup-error">{deleteError}</p>}
            <div className="delete-popup-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsDeletePopupOpen(false);
                  setDeleteError("");
                }}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleDeleteAccount}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="courses-section">
        <h2 className="section-title">My Courses</h2>
        <div className="course-list">
          {myCourses.slice(0, myCoursesVisibleCount).map((course) => (
            <div
              className="course-card"
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="course-info">
                {course.logo && (
                  <img
                    src={`http://localhost:5000/logos/${course.logo}`}
                    alt={`${course.title} Logo`}
                    className="course-logo"
                  />
                )}
                <h3 className="course-title">{course.title}</h3>
                <div className="progress-wrapper">
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: getProgressForCourse(course._id) }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {getProgressForCourse(course._id)}
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
        {myCoursesVisibleCount < myCourses.length && (
          <button
            className="view-all-btn"
            onClick={() => setMyCoursesVisibleCount(myCoursesVisibleCount + 3)}
          >
            View More
          </button>
        )}
      </section>

      <section className="courses-section">
        <h2 className="section-title">Available Courses</h2>
        <div className="course-list">
          {availableCourses
            .slice(0, availableCoursesVisibleCount)
            .map((course) => (
              <div
                className="course-card new-course"
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="course-info">
                  {course.logo && (
                    <img
                      src={`http://localhost:5000/logos/${course.logo}`}
                      alt={`${course.title} Logo`}
                      className="course-logo"
                    />
                  )}
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-status">{course.description}</p>
                </div>
                <button className="start-button">
                  <span className="start-icon">🎯</span>
                  Start Learning
                </button>
              </div>
            ))}
        </div>
        {availableCoursesVisibleCount < availableCourses.length && (
          <button
            className="view-all-btn"
            onClick={() =>
              setAvailableCoursesVisibleCount(availableCoursesVisibleCount + 3)
            }
          >
            View More
          </button>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

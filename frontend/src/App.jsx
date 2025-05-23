import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CourseDetail from "./components/CourseDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Homepage from "./components/Homepage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import "./App.css";
import CertificatePage from "./components/CertificatePage";
import CoursePage from "./components/CoursePage.jsx";
import ContactUs from "./components/ContactUs.jsx";
import BlogPage from "./components/BlogPage.jsx";


const App = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses from the backend
    axios
      .get("http://192.168.56.1:5000/api/courses")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate/:courseId"
          element={
            <ProtectedRoute>
              <CertificatePage courses={courses} />
            </ProtectedRoute>
          }
        />
        <Route path="/courses" element={<CoursePage courses={courses} />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Router>
  );
};

export default App;

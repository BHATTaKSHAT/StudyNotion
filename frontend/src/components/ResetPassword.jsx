import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(600);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location]);

   useEffect(() => {
     const interval = setInterval(() => {
       setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
     }, 1000);

     return () => clearInterval(interval);
   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !resetCode || !newPassword) {
      setMessage("All fields are required.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be at least 6 characters long and contain both letters and numbers."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        {
          email,
          resetCode,
          newPassword,
        }
      );
      setMessage(response.data.message);

      // Navigate to login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage("Invalid or expired reset code.");
      } else {
        setMessage("Error resetting password. Please try again.");
      }
      console.error(error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p>Time remaining: {formatTime(timer)}</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter reset code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;

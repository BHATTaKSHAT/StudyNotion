import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      setMessage("Login successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("No email found");
      } else if (error.response?.status === 401) {
        setMessage("Wrong password");
      } else {
        setMessage("Login failed. Please try again.");
      }
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {message && (
          <div
            className={`message ${
              message.includes("successful") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
        <p>
          Don't have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
        <p>
          Forgot your password?{" "}
          <span className="link" onClick={() => navigate("/forgot-password")}>
            Reset it here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;

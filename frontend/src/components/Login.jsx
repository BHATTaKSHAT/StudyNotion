import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      localStorage.setItem("username", response.data.username); // Ensure this line is present
      navigate("/dashboard");
    } catch (error) {
      setMessage("Login failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      {message && <p>{message}</p>}
      <p>
        Don't have an account?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Sign up
        </span>
      </p>
    </form>
  );
};

export default Login;

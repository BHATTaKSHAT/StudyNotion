import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button className="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

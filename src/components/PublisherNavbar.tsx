import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublisherNavbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      <Link to="/publisher" style={{ marginRight: 12 }}>
        Publisher Dashboard
      </Link>
      <Link to="/upload" style={{ marginRight: 12 }}>
        Upload
      </Link>
      <span style={{ float: "right" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  );
};

export default PublisherNavbar;

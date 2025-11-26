import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ReaderNavbar: React.FC = () => {
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
      <Link to="/reader" style={{ marginRight: 12 }}>
        Reader Dashboard
      </Link>
      <span style={{ float: "right" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  );
};

export default ReaderNavbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const dashboardPath =
    role === "publisher" ? "/publisher" : role === "reader" ? "/reader" : "/";

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      {user ? (
        <>
          <Link to="/" style={{ marginRight: 12 }}>
            Home
          </Link>
          {role && (
            <Link to={dashboardPath} style={{ marginRight: 12 }}>
              Dashboard
            </Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 12 }}>
            Login
          </Link>
          <Link to="/signup">Signup</Link>
        </>
      )}

      {user && (
        <span style={{ float: "right" }}>
          <strong style={{ marginRight: 8 }}>{role ?? "no-role"}</strong>
          <button onClick={handleLogout}>Logout</button>
        </span>
      )}
    </nav>
  );
};

export default Navbar;

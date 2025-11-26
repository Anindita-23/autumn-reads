import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { Role } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

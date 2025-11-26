import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { Role } from "../context/AuthContext";

type AllowedRole = Exclude<Role, null>;

interface Props {
  children: JSX.Element;
  allowed: AllowedRole[];
}

const RoleRoute: React.FC<Props> = ({ children, allowed }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!role || !allowed.includes(role as AllowedRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default RoleRoute;

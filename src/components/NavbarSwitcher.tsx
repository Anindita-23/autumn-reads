import React from "react";
import { useRole } from "../context/RoleContext";
import ReaderNavbar from "./ReaderNavbar";
import PublisherNavbar from "./PublisherNavbar";
import { useAuth } from "../hooks/useAuth";

const NavbarSwitcher: React.FC = () => {
  const { role, loading } = useRole();
  const { user } = useAuth();

  if (loading) return <div style={{ height: 56 }} />;

  if (!user) return null;

  if (role === "publisher") return <PublisherNavbar />;
  return <ReaderNavbar />;
};

export default NavbarSwitcher;

import React from "react";
import useAuth from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {user?.email}</p>
      {role === "publisher" && <h2>Publisher Dashboard</h2>}
      {role === "reader" && <h2>Reader Dashboard</h2>}
      {!role && <div>No role assigned.</div>}
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublisherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToUpload = () => navigate("/upload");

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-2">Publisher Dashboard</h1>
        <p className="text-base text-neutral-700">Welcome, {user?.email}</p>
        <p className="text-base text-neutral-700 mt-2">
          This area is for publishers only.
        </p>

        <div className="mt-6">
          <button
            onClick={goToUpload}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg"
          >
            Go to Upload Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;

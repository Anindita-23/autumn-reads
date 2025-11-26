import React from "react";
import useAuth from "../hooks/useAuth";

const ReaderDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-2">Reader Dashboard</h1>
        <p className="text-base text-neutral-700">Welcome, {user?.email}</p>
        <p className="text-base text-neutral-700 mt-2">
          This area is for readers only.
        </p>

        <section className="mt-6 p-4 border border-dashed border-neutral-200 rounded-md">
          <h3 className="text-2xl font-medium mb-2">Coming soon</h3>
          <p className="text-neutral-700">
            Placeholder for reader features: saved books, bookmarks, and reading
            lists.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReaderDashboard;

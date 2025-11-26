import React from "react";

const NotAuthorized: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Not authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default NotAuthorized;

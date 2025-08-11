import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

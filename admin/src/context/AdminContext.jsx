import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = (adminData, token) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  const value = {
    admin,
    setAdmin,
    loginAdmin,
    logoutAdmin,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

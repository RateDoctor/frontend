import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);


   // Load auth from localStorage on page refresh
    useEffect(() => {
      const savedToken = localStorage.getItem("authToken");
      const savedRole = localStorage.getItem("userRole");

      if (savedToken && savedRole) {
        setToken(savedToken);
        setRole(savedRole);
      }
      setLoading(false);  // done loading
    }, []);



const login = (userToken, userRole) => {
  setToken(userToken);
  setRole(userRole);

  localStorage.setItem("authToken", userToken);
  localStorage.setItem("userRole", userRole);
};


  const logout = () => {
    setToken(null);
    setRole(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  };

  const isAuthenticated = !!token;
  const isSupervisor = role === "supervisor";
  const isStudent = role === "student";

  return (
  <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        role,
        isSupervisor,
        isStudent,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
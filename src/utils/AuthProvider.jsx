import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);


   // Load auth from localStorage on page refresh
    useEffect(() => {
      const savedToken = localStorage.getItem("authToken");
      const savedRole = localStorage.getItem("userRole");

        console.log("Loaded token from localStorage:", savedToken);
        console.log("Loaded role from localStorage:", savedRole);

      if (savedToken && savedRole) {
        setToken(savedToken);
        setRole(savedRole);
      }
      setLoading(false);  // done loading
    }, []);



const login = (userToken, userRole) => {
  localStorage.setItem("authToken", userToken);
  localStorage.setItem("userRole", userRole);
  setToken(userToken);     // ✅ must be present
  setRole(userRole);       // ✅ must be present
};


  const logout = () => {
    setLoggingOut(true); 
    setToken(null);
    setRole(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  };

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";
  const isStudent = role === "student";
  const currentUser = token
    ? { token, role } 
    : null;
    
  return (
  <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        role,
        currentUser,
        isAdmin,
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
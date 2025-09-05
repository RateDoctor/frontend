import React, { useState } from "react";
import { FiMail, FiLock, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import Loader from "../../layouts/load/load";
import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Small delay for UX (optional)
    setTimeout(() => {
      logout(); // Clear token + role in context + localStorage
      localStorage.removeItem("currentUser"); 
      setIsLoggingOut(false);
      navigate("/"); // Navigate to login screen
    }, 1000);
  };

  return (
    <div className="settings-container">
      {/* Loader overlay for logout */}
      {isLoggingOut && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      {/* Header */}
      <div className="settings-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
        <h2>Settings</h2>
      </div>

      {/* Settings Options */}
      <div className="settings-list">
        <div className="settings-item" onClick={() => navigate("/settings/change-email")}>
          <FiMail className="settings-icon" />
          <span>Change Email</span>
        </div>
        <hr />

        <div className="settings-item" onClick={() => navigate("/settings/change-password")}>
          <FiLock className="settings-icon" />
          <span>Change Password</span>
        </div>
        <hr />

        <div className="settings-item" onClick={handleLogout}>
          <FiLogOut className="settings-icon" />
          <span>Logout</span>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Settings;


// import React from "react";
// import { FiMail, FiLock, FiLogOut, FiArrowLeft } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../utils/AuthProvider";
// import "./settings.css";

// const Settings = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();            // Clear token + role in context + localStorage
//     navigate("/login");  // Navigate to login screen
//   };

//   return (
//     <div className="settings-container">
//       {/* Header */}
//       <div className="settings-header">
//         <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
//         <h2>Settings</h2>
//       </div>

//       {/* Settings Options */}
//       <div className="settings-list">
//         <div className="settings-item" onClick={() => navigate("/settings/change-email")}>
//           <FiMail className="settings-icon" />
//           <span>Change Email</span>
//         </div>
//         <hr />

//         <div className="settings-item" onClick={() => navigate("/settings/change-password")}>
//           <FiLock className="settings-icon" />
//           <span>Change Password</span>
//         </div>
//         <hr />

//         <div className="settings-item" onClick={handleLogout}>
//           <FiLogOut className="settings-icon" />
//           <span>Logout</span>
//         </div>
//         <hr />
//       </div>
//     </div>
//   );
// };

// export default Settings;

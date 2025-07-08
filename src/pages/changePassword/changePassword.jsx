import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/AuthProvider";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./changePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Update failed.");
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-header">
        <FiArrowLeft className="icon" onClick={() => navigate("/settings")} />
        <span>Settings</span>
      </div>

      <h2 className="section-title">Change Password</h2>

      <form className="password-form" onSubmit={handleSubmit}>
        {/* Current password */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <span
            onClick={() => setShowCurrent(!showCurrent)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
            }}
          >
            {showCurrent ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* New password */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>New Password</label>
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <span
            onClick={() => setShowNew(!showNew)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
            }}
          >
            {showNew ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {/* Confirm new password */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
            }}
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit" className="change-password-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;


// import React from "react";
// import { FiArrowLeft } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import "./changePassword.css"; // Separate CSS file for this page

// const ChangePassword = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="change-password-container">
//       {/* Header with back and title */}
//       <div className="change-password-header">
//         <FiArrowLeft className="icon" onClick={() => navigate("/settings")} />
//         <span>Settings</span>
//       </div>

//       <h2 className="section-title">Change Password</h2>

//       <form className="password-form">
//         <div className="form-group">
//           <label>Current Password</label>
//           <input type="password" placeholder="Enter current password" />
//         </div>

//         <div className="form-group">
//           <label>New Password</label>
//           <input type="password" placeholder="Enter new password" />
//         </div>

//         <div className="form-group">
//           <label>Confirm New Password</label>
//           <input type="password" placeholder="Confirm new password" />
//         </div>

//         <button type="submit" className="change-password-button">
//           Change Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;

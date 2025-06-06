import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./changePassword.css"; // Separate CSS file for this page

const ChangePassword = () => {
  const navigate = useNavigate();

  return (
    <div className="change-password-container">
      {/* Header with back and title */}
      <div className="change-password-header">
        <FiArrowLeft className="icon" onClick={() => navigate("/settings")} />
        <span>Settings</span>
      </div>

      <h2 className="section-title">Change Password</h2>

      <form className="password-form">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" placeholder="Enter current password" />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" placeholder="Confirm new password" />
        </div>

        <button type="submit" className="change-password-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

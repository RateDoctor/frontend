import React from "react";
import { FiMail, FiLock, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
        <h2>Settings</h2>
      </div>

      {/* Settings List */}
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

        <div
          className="settings-item"
          onClick={() => {
            alert("Logged out");
            navigate("/");
          }}
        >
          <FiLogOut className="settings-icon" />
          <span>Logout</span>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Settings;

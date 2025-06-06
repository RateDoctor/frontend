import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./changeEmail.css"; // Separated CSS file

const ChangeEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="change-email-container">
      {/* Top bar with back arrow and title */}
      <div className="change-email-header">
        <FiArrowLeft className="icon" onClick={() => navigate("/settings")} />
        <span>Settings</span>
      </div>

      {/* Section Title */}
      <h2 className="section-title">Change Email Address</h2>

      <form className="email-form">
        <div className="form-group">
          <label>Current Email Address</label>
          <input type="email"  />
        </div>

        <div className="form-group">
          <label>New Email Address</label>
          <input type="email"  />
        </div>

        <div className="form-group">
          <label>Confirm New Email Address</label>
          <input type="email"  />
        </div>

        <button type="submit" className="change-email-button">
          Change Email
        </button>
      </form>
    </div>
  );
};

export default ChangeEmail;

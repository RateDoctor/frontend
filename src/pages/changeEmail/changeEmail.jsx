import React, { useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import "./changeEmail.css";
const BASE_URL = process.env.REACT_APP_API_URL;


const ChangeEmail = () => {
  const [enteredCurrentEmail, setEnteredCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth(); // Assuming `user.email` is available
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newEmail !== confirmEmail) {
      return alert("New email and confirmation do not match.");
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/api/users/change-email`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Token being sent:", token);
      alert(response.data.message || "Email updated. Check your inbox.");
      setNewEmail("");
      setConfirmEmail("");
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        alert("This email is already in use.");
      } else if (status === 400) {
        alert(err.response?.data?.error || "Invalid input.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-email-container">
      <div className="change-email-header">
        <FiArrowLeft className="icon" onClick={() => navigate("/settings")} />
        <span>Settings</span>
      </div>

      <h2 className="section-title">Change Email Address</h2>

      <form className="email-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Email Address</label>
          <input
            type="email"
            value={enteredCurrentEmail}
            onChange={(e) => setEnteredCurrentEmail(e.target.value)}
            placeholder="Enter your current email"
            required
          />
        </div>

        <div className="form-group">
          <label>New Email Address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Email Address</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Confirm new email"
            required
          />
        </div>

        <button type="submit" className="change-email-button" disabled={loading}>
          {loading ? "Updating..." : "Change Email"}
        </button>
      </form>
    </div>
  );
};

export default ChangeEmail;

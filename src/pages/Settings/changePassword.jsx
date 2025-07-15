import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/AuthProvider";
import { FiEye, FiEyeOff } from "react-icons/fi";
const BASE_URL = process.env.REACT_APP_API_URL;



const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/users/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h3>Change Password</h3>

      {/* Current password */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type={showCurrent ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          required
          style={{ width: "100%", paddingRight: "40px" }}
        />
        <span
          onClick={() => setShowCurrent((prev) => !prev)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showCurrent ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>

      {/* New password */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type={showNew ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          required
          style={{ width: "100%", paddingRight: "40px" }}
        />
        <span
          onClick={() => setShowNew((prev) => !prev)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showNew ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>

      <button type="submit">Update Password</button>
    </form>
  );
};

export default ChangePassword;

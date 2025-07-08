import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/AuthProvider";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newEmail !== confirmEmail) {
      alert("New email and confirmation email do not match.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/auth/change-email",
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Email updated. Please verify the new email.");
      setNewEmail("");
      setConfirmEmail("");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This email is already taken. Please use another one.");
      } else {
        alert(err.response?.data?.error || "Update failed.");
      }
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h3>Change Email</h3>

      <label>New Email Address</label>
      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="New email"
        required
      />

      <label>Confirm New Email Address</label>
      <input
        type="email"
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.target.value)}
        placeholder="Confirm new email"
        required
      />

      <button type="submit" style={{ marginTop: 10 }}>
        Update Email
      </button>
    </form>
  );
};

export default ChangeEmail;

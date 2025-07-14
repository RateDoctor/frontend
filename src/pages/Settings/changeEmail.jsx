import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/AuthProvider";
const BASE_URL = process.env.REACT_APP_API_URL;



const ChangeEmail = () => {
  const [email, setEmail] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/auth/change-email`,
        { newEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Email updated. Please verify the new email.");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Change Email</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="New email"
        required
      />
      <button type="submit">Update Email</button>
    </form>
  );
};

export default ChangeEmail;
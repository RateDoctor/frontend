import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;

const RequestAdminAccess = () => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // your JWT from login
      await axios.post(
        `${BASE_URL}/api/admin-access/request`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Request sent successfully. Waiting for admin approval.");
      setReason("");
      // Optionally redirect or disable form after success
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-admin-access">
      <h1>Request Admin Access</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Reason for Admin Access:
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            required
          />
        </label>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestAdminAccess;

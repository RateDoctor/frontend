import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const statusColors = {
  pending: "#007bff",  // blue
  approved: "#28a745", // green
  rejected: "#dc3545"  // red
};

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-access/requests`,
            {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch {
        setError("Failed to load admin requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await axios.post(`${BASE_URL}/api/admin-access/requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r))
      );
    } catch {
      alert("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await axios.post(`${BASE_URL}/api/admin-access/requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
      );
    } catch {
      alert("Failed to reject request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p>Loading admin requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (requests.length === 0) return <p>No pending requests.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h1>Admin Access Requests</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {requests.map(({ _id, userId, reason, status }) => (
          <li
            key={_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
            aria-live="polite"
          >
            <p>
              <strong>User:</strong> {userId.userId} ({userId.email})
            </p>
            <p>
              <strong>Reason:</strong> {reason}
            </p>
            <p>
              <strong>Status: </strong>
              <span
                style={{
                  color: statusColors[status] || "#000",
                  fontWeight: "bold",
                  textTransform: "capitalize"
                }}
              >
                {status}
              </span>
            </p>

            {status === "pending" ? (
              <>
                <button
                  onClick={() => handleApprove(_id)}
                  disabled={processingId === _id}
                  aria-label={`Approve request from ${userId.userId}`}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: processingId === _id ? "not-allowed" : "pointer",
                    marginRight: 8,
                  }}
                >
                  {processingId === _id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(_id)}
                  disabled={processingId === _id}
                  aria-label={`Reject request from ${userId.userId}`}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: processingId === _id ? "not-allowed" : "pointer",
                  }}
                >
                  {processingId === _id ? "Processing..." : "Reject"}
                </button>
              </>
            ) : (
              <p style={{ fontStyle: "italic", color: "#555" }}>
                This request has been {status}.
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        const { userId } = response.data;
        setMessage("Email verified successfully!");
        setTimeout(() => {
          navigate(`/welcome/${userId}`);
        }, 2000); // short delay to show message
      } catch (err) {
        console.error(err);
        setMessage("Invalid or expired verification link.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default Verify;

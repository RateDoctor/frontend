import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        const userId = res.data.userId;
        navigate(`/welcome/${userId}`);
      } catch (err) {
        setStatus("Verification failed.");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return <div>{status}</div>;
};

export default Verify;

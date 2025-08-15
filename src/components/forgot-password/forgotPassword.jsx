import React, { useState } from "react";
import axios from "axios";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import "./forgotPassword.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/users/forgot-password`, { email });
      setMessage(response.data.message || "Reset link sent. Check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <MdOutlineKeyboardArrowLeft
        className="wrapper-arrow-left"
        onClick={() => navigate("/login")}
      />
      <div className="big-circle"></div>
      <div className="top-circle"></div>
      <div className="down-circle"></div>

      <div className="form-wrapper">
        <h2 className="title-headLogin">Forgot Password</h2>
        <form className="register-inputsLogin forgot-register-input" onSubmit={handleSubmit}>
          <p className="forgot-text">
            Enter your email to receive a password reset link.
          </p>

          <div className={`input-group ${email ? "filled" : ""}`}>
            <input
              className="login-input"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <div className="register-buttons">
            <div className="button-register-box button-forgot">
              <button className="buttonSubmit-login" type="submit" disabled={loading}>
                  {loading ? "Sending..." : <FaArrowRight className="arrowRight" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

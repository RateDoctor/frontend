import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

import "./singup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!form.email || !emailRegex.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.password || !passwordRegex.test(form.password))
      newErrors.password =
        "Password must be at least 6 chars, include uppercase, lowercase, number, and special character";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsLoading(true);
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", form);
    const { userId, verificationToken } = response.data;


    localStorage.setItem("verificationToken", verificationToken);
    localStorage.setItem("userId", userId)
    // Navigate to checking page with userId + token
    navigate("/checking", { state: { userId, token: verificationToken, email: form.email } });
  } catch (err) {
    setSubmitError(err?.response?.data?.error || "Registration failed");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="signup-wrapper">
     
      <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>

      <div className="signup-form">
        <p className="title-head-signup">Create Account</p>
        <form className="singup-inputs" onSubmit={handleSubmit}>
          {/* Email */}
          <p className="label-singup">Enter your email address</p>
          <div className={`singup-input-group ${form.email ? "filled" : ""}`}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
              autoComplete="email"
            />
            <label className="singup-input-label">Your Email</label>
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          {/* Password */}
          <p className="label-singup form-password">
            Choose a secure password for your account
          </p>
          <div
            className={`singup-input-group ${form.password ? "filled" : ""}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input"
              autoComplete="new-password"
            />
            {showPassword ? (
              <AiOutlineEyeInvisible
                className="showing-singup-password"
                size={25}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiOutlineEye
                className="showing-singup-password"
                size={25}
                onClick={() => setShowPassword(true)}
              />
            )}

            <label className="singup-input-label">Password</label>
            {errors.password && <div className="error">{errors.password}</div>}
            <p className="remember-password-char">
              Your password should be at least 6 characters long and include a
              mix of letters, numbers, and special characters.
            </p>
          </div>

          {/* Submission Error */}
          {submitError && <div className="error">{submitError}</div>}

          <div className="register-loginSingUp-box">
            <h1 className="signupForm-label">Sign in</h1>
          </div>



           <div className="circle-container">
              <div className="circle-right"></div>
              <div className="singup-arrowButton">
                <h1 className="signup">Sign Up</h1>
                <button className="circle-button" type="submit" disabled={isLoading}>
                  <FaArrowRight className="arrowRight" />
                </button>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

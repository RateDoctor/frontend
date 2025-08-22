import {  useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./singin.css";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";
import Loader from "../../layouts/load/load";
import { useAuth } from "../../utils/AuthProvider";
const BASE_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  // const [form, setForm] = useState({ userId: "", password: "" });
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const { login } = useAuth();


  {isLoading && <Loader />}

  const goToSignup = () => {
    navigate("/singup");
  };

 const goToChangePassword = (e) => {
  e.preventDefault();
  console.log("Navigate called");
  navigate("/");
};

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
  setErrors((prev) => ({ ...prev, [name]: "" }));
};

const goToForgotPassword = (e) => {
  e.preventDefault();
  navigate("/forgot-password");
};


const handleTogglePassword = () => setVisible(!visible);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  console.log("Login form values:", {
    id: form.userId,
    password: form.password,
  });

  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`,
       {
        // id: form.userId.trim(),
        loginField: form.identifier.trim(),
        password: form.password.trim(),
      },
         {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
    );
      
 
    console.log("Full login response:", response);
    console.log("Response data:", response.data);

    const { token, user } = response.data;

    
     console.log("Login success:", response.data);
     console.log("Logging in with role:", user.role);

    

        // Validate presence of critical fields
    if (!token || !user?.role) {
      throw new Error("Invalid login response: Missing token or role.");
    }
 
      // ✅ Store user info in localStorage
     localStorage.setItem("userId", user._id);
     localStorage.setItem("authToken", token);

      console.log("User object:", user);
      console.log("User ID:", user._id);

    // Continue with your login context (if needed)
    login(token, user.role);

     setTimeout(() => {
      if (user.role === "admin") {
        navigate("/dashboard/users");
      } else {
        navigate("/");
      }
    }, 3000); 

  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    setLoginError(err.response?.data?.message || "Login failed.");
  } finally {
    setIsLoading(false); // ✅ stop loader
  }
};




 
  return (
    <div className="register-form">
      <div className="big-circle"></div>
      <div className="top-circle"></div>
      <div className="down-circle"></div>

     

    <div className="form-wrapper">

      <h2 className="title-headLogin">Welcome Back!</h2>
  
        <form
          className="register-inputsLogin"
          onSubmit={handleSubmit}
        >
        <p className="enter-id-password">Please enter your unique ID number and password.</p>
          <div  className={`input-group ${form.identifier ? "filled" : ""}`}>
            <input
            className="login-input"
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required 
            disabled={isLoading}
            />

            <label htmlFor="identifier" className="input-label singin-input-label">
              {/* id number */}
              Account Key
            </label>
            {loginError && <div className="error">{loginError}</div>}
          </div>

          <div className={`input-group ${form.password ? "filled" : ""}`}>

             <input
              className="login-input"
              name="password"
              type={visible ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
            />
                  
              <AiOutlineEye
                className="showing-password"
                size={25}
                onClick={handleTogglePassword}
              />
        
              <AiOutlineEyeInvisible
                className="showing-password"
                size={25}
                onClick={handleTogglePassword}
              />
      
            <label htmlFor="password" className="input-label  singin-input-label">
              Password
            </label>
             {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="register-buttons">
            <div className="button-register-box">
              <h1 className="label-signin">Sign in</h1>
                <button
                   className="buttonSubmit-login"
                    type="submit"
                    disabled={isLoading}>
                    {isLoading ? "Signing in..." : <FaArrowRight className="arrowRight" />}
                </button>
            </div>    
          </div>

             <div className="register-login-box">
            <h1 className="signup-label" onClick={goToSignup}>
              Sign Up
            </h1>

             
              <h3 className="forget-password" onClick={goToForgotPassword}>
                Forgot Password
              </h3>
             </div>


        </form>
      </div>
    </div>
  );
};

export default Login;

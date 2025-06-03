import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
import Logo from "../../imgs/rateLogo.png";
import "./singup.css";
// import cookie from "react-cookies";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";

// import { useAuth } from "../utils/AuthProvider";

const Signup = () => {
//   const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showAnimation, setShowAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
 
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = cookie.load("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  //   const timer = setTimeout(() => setShowAnimation(false), 2000);
  //   return () => clearTimeout(timer);
  // }, [navigate]);

   useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleTogglePassword = () => setVisible(!visible);

  const validateUsername  = () => {
    if (!username) {
      setUsernameError("id is required");
      return false;
    } 
    // Add your username validation rules
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Allows letters, numbers, underscores, 3-15 characters
  if (!usernameRegex.test(username)) {
    setUsernameError("Username must be 3-15 characters long and can include letters, numbers, and underscores.");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    // Modern password validation: At least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateUsername()) {
//       setLoginError("Invalid Username format.");
//       return;
//     }
//     if (!validatePassword()) {
//       setLoginError("Password must meet the required criteria.");
//       return;
//     }
//     setIsLoading(true); // Start the loading spinner

//       try {
//         // Send a POST request to the backend with username and password
//         const response = await axios.post("http://localhost:5000/api/user/login", {
//           username,
//           password,
//         });
      

  
//         const { token, user } = response.data;

//         if (!token || !user?.role) {
//           throw new Error("Invalid login response: Missing department information");
//         }
//          // ✅ Store Token Securely in HTTP-Only Cookie (HIGH SECURITY)

//         // document.cookie = `authToken=${token}; path=/; secure; HttpOnly; SameSite=Strict`;
//        // ✅ Store User Role in Local Storage
 
//         localStorage.setItem("authToken", token);
//         localStorage.setItem('role', user.role);

//         // Only save department for nurses
//     if (user.role === "nurse" && user.department) {
//       localStorage.setItem("nurseDepartment", user.department._id);
//       localStorage.setItem("nurseId", user._id);
//     } else {
//       localStorage.removeItem("nurseDepartment");
//       localStorage.removeItem("nurseId",user._id || user.id);
//     }

     

//         login(token);

       

//         // Redirect to dashboard on successful login
//           if (user.role === "superAdmin") {
//             navigate("/admin"); // Redirect to the admin path for superAdmin
//           } else {
//             navigate("/patient"); // Redirect to the dashboard path for other roles
//           }

//           // ✅ Redirect User Based on Role
//       // navigate(user.role === "superAdmin" ? "/admin" : "/patient");
         
//       } catch (error) {
//          // Handle API errors or unexpected issues
//         setLoginError(error.response?.data?.message || "Login failed. Please try again");
//         setIsLoading(false);
//         // Handle errors from the backend (e.g., wrong username/password)
//         if (error.response && error.response.data) {
//           alert(error.response.data.message || "Login failed. Please try again.");
//         } else {
//           alert("An unexpected error occurred. Please check your connection and try again.");
//         }
//       }finally{
//         setIsLoading(false); // Always stop the loading spinner
//       }
//   };


 
  return (
    <div className="register-formSingup">

      <h2 className="title-head">Create Account</h2>
     
      {isLoading && (
        <>
          <div className="overlay"></div>
          <div className="loading-circle"></div>
        </>
      )}

      {showAnimation ? (
        <div className="animation">
          <img className="register-img" src={Logo} alt="Logo" />
        </div>
      ) : (
        <form
          className={`register-inputsSingup ${isLoading ? "disabled" : ""}`}
        //   onSubmit={handleSubmit}
        >

        <p className="enter-id-password">Please enter your unique ID number and password.</p>
          <div className="input-group">
            <input
              type="username"
              autoComplete="username"
              className="input"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)} 
              />

            <label htmlFor="username" className="input-label">
              id number
            </label>
            {usernameError && <div className="error">{usernameError}</div>}
          </div>

          <div className="input-group">
            <input
              className="input"
              type={visible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {visible ? (
              <AiOutlineEye
                className="showing-password"
                size={25}
                onClick={handleTogglePassword}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="showing-password"
                size={25}
                onClick={handleTogglePassword}
              />
            )}
            <label htmlFor="password" className="input-label">
              Password
            </label>
            {passwordError && <div className="error">{passwordError}</div>}
          </div>

          <div className="register-buttons-singup">
            

             <h1 className="signup signin">Sign Up</h1>

             <button
              className="buttonSubmit-content-or"
              type="submit"
              disabled={isLoading}
            >
              {/* {isLoading ? "Logging in..." : "Login"} */}
              <FaArrowRight className="arrowRight" />

            </button>
          </div>
             <div className="register-login-box">
             <h1 className="signup-label">Sign in</h1>
          </div>


        </form>
      )}
    </div>
  );
};

export default Signup;

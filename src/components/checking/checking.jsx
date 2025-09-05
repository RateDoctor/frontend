import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";
import "./checking.css";
const BASE_URL = process.env.REACT_APP_API_URL;


const Checking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token, email } = location.state || {};



useEffect(() => {
  const verify = async () => {
    const token = location.state?.token;
    console.log("Using token to verify:", token); // ✅ Add this log
    try {
      const res = await axios.get(`${BASE_URL}/api/users/verify/${token}`);
      console.log("Email verified:", res.data);
      navigate("/login");
    } catch (err) {
      console.error("Verification error:", err.response?.data);
    }
  };

  if (location.state?.token) {
    verify();
  }
}, []);



   const handleResend = async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/resend-verification`, { email });
      alert("Verification email resent!");
    } catch (err) {
      alert("Failed to resend verification.");
    }
  };

  return (
    <div className="signup-wrapper">
      <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>
      
  <div className="paragraphs-box"> 
                    <p className="middle-paragraph">An email has been sent to the address provided. Please check your inbox.</p>
                    <p className="middle-paragraph">Click the link in the email to confirm your account and complete the sign-up process.</p>
                    <p className="middle-paragraph hyperlink"> Haven't received the email?
                      <strong  onClick={handleResend} className="link-lickble">Click here to resend.</strong></p> 
      </div>
        <div className="circle-container">  
           <div className="circle-right"></div>
              <div className="singup-arrowButton">
                <h1 className="signup"></h1>
                    <button
                      className="circle-button"
                      type="submit">
                      <FaArrowRight className="arrowRight" />
                    </button>
                </div>
         </div>
          <div className="">
              <p className="title-head-signup">Create Account</p>
          </div>
    </div>
  );
};

export default Checking;

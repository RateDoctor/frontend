import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";
import "./checking.css";


const Checking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token, email } = location.state || {};


   const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-verification", { email });
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

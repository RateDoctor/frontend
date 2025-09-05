import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";
import "./logout.css";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/", { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);



  return (
  <div className="signup-wrapper">
       <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>
      
  <div className="paragraphs-welcome-box"> 
      <p className="middle-paragraph  successfully-paragraph">You have successfully logged out! </p>
      <p className="middle-paragraph  logout-paragraph">
         We look forward to seeing you again soon!
         If you need further assistance, feel free to reach out to us.
     </p>  
      </div>
        <div className="circle-container">  
           <div className="circle-right"></div>
         </div>
          <div className="">
              <p className="title-head-signup  title-logout">Logout</p>
          </div>
    </div>
  );
};

export default Logout;

import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
import "./forgotPassword.css";  
// import cookie from "react-cookies";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";


const Login = () => {

  return (
    <div className="register-form  forgot-register">
    <div className="register-inputsLogin  forgot"></div>
      <h2 className="title-headLogin">Welcome Back!</h2>
      <div className="paragraphs-box-forgot">
            <p className="forgot-paragraph">
                We've just sent you an email containing a link to reset your password.</p>
                <p className="forgot-paragraph">
                    Please check your inbox (and spam/junk folder, just in case)
                     and follow the instructions provided.
                </p>
                <p className="forgot-paragraph hyperlink"> Haven't received the email? 
                    <a href="#"  className="link-forgot">Click here to resend.</a>
                </p> 
      </div>
      
  
                <button className="buttonSubmit-content-or  register-buttons button" type="submit">
                   <FaArrowRight className="arrowRight" />
                </button>
    </div>
  );
};

export default Login;

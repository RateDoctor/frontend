import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FaArrowRight } from "react-icons/fa6";
import "./uploadfile.css";



const UploadFile = () => {


return (
   <div className="register-formSingup">

      <p className="title-head">Create Account</p>

      <div className="register-inputsSingup"></div>


   
    <div className="register-buttons-singupUpload">
               
   
   
                <button
                 className="buttonSubmit-content-or"
                 type="submit" >
                 <FaArrowRight className="arrowRight" />
   
               </button>
             </div>

    <h1 className="signupForm-labelUpload"></h1>


    </div>
  );
};

export default UploadFile;

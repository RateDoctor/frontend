import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuFilePlus2 } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { PiFilePdfDuotone } from "react-icons/pi";
import { SiGoogledocs } from "react-icons/si";
import { TbFileTypeTxt } from "react-icons/tb";

import "./uploadFile.css";

const handleResend = () => {
  // Your logic to resend the verification email
  console.log("Resend email triggered");
};

const Upload = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

   const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      navigate("/checking");
    }, 2000); // simulate 2s upload
  };
  return (
    <div className="signup-wrapper">
         <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>
        
        <div className="paragraphs-upload-box"> 
            <p className="upload-middle-paragraph">Upload a file containing your information.</p>
            <div className="upload-file-container">
                <div className="child-upload-file-container">
                    <span className="upload-cancel">Cancel</span>
                    <LuFilePlus2 className="upload-file" id="upload-file"/>
                    <PiFilePdfDuotone className="upload-file" id="upload-pdf"/>
                    <TbFileTypeTxt className="upload-file" id="upload-txt"/>
                    <SiGoogledocs className="upload-file" id="upload-doc"/>
                    <p className="title-upload-file">Click to upload</p>
                    <p className="uploading-file-name">phoenix-document.pdf</p>
                    <p className="uploading-line"> <span className="percentage-uploading">40%</span>  <span className="uploading">Uploading</span> ·  <span className="megabyte-uploading">8.77 MB</span></p> 
               </div>
            </div>
                       <ul className="container-upload-lists">
                        <li className="type-upload">PDF</li>
                        <li className="type-upload">DOCX</li>
                        <li className="type-upload">TXT</li>
                        <li className="type-upload " id="megabyte"> > 10 MB</li>
                       </ul>
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

export default Upload;

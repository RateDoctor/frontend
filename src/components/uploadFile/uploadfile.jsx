import { useNavigate } from "react-router-dom";
import { LuFilePlus2 } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import "./uploadFile.css";

const handleResend = () => {
  // Your logic to resend the verification email
  console.log("Resend email triggered");
};

const Upload = () => {
  return (
    <div className="signup-wrapper">
        <div className="paragraphs-upload-box"> 
            <p className="upload-middle-paragraph">Upload a file containing your information.</p>
            <div className="upload-file-container">
                <div className="child-upload-file-container">
                    <LuFilePlus2 className="upload-file"/>
                    <p className="title-upload-file">Click to upload</p> 
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

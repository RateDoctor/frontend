import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import "./welcome.css";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";


const Welcome  = () => {
  const { id } = useParams();
  return (
    <div className="signup-wrapper">
       <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>
      
  <div className="paragraphs-welcome-box"> 
    <h3 className="congratulation-title">Congratulations!</h3>
      <p className="middle-paragraph">You've successfully signed up for our platform. </p>
      <p className="middle-paragraph id-hyperlink"> Your unique ID is
         <strong  className="link-id">{id}</strong>
      </p> 
      <p className="middle-paragraph">This ID will be your identifier on our platform, ensuring your privacy and security.</p>

      <p className="middle-paragraph  info-paragraph">
        Thank you for joining our community! 
        Feel free to explore and rate PhD supervisors
        to contribute to a collaborative and informed academic environment.</p> 
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
              <p className="title-head-signup  title-welcome">You’re Welcome!</p>
          </div>
    </div>
  );
};

export default Welcome;

import { FaArrowRight } from "react-icons/fa6";
import "./welcome.css";


const welcome = () => {
  return (
    <div className="signup-wrapper">
  <div className="paragraphs-welcome-box"> 
    <h3 className="congratulation-title">Congratulations!</h3>
      <p className="middle-paragraph">You've successfully signed up for our platform. </p>
      <p className="middle-paragraph id-hyperlink"> Your unique ID is
         <a href="#"  className="link-id">7919</a>
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

export default welcome;

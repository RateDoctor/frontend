import "./forgotPassword.css";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";


const Forgot = () => {
  return (
    <div className="register-form">
        <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>

      <div className="big-circle"></div>
      <div className="top-circle"></div>
      <div className="down-circle"></div>


    <div className="form-wrapper">

      <h2 className="title-headLogin">Forgot Password</h2>
  
        <form className="register-inputsLogin  forgot-register-input">

        <p className="forgot-text">We've just sent you an email containing a link to reset your password.</p>
        <p className="forgot-text">Please check your inbox (and spam/junk folder, just in case) and follow the instructions provided.</p>
        <p className="forgot-text forgot-hyperlink"> Haven't received the email?
                      <a href="#"  className="link-lickble">Click here to resend.</a></p> 



          <div className="register-buttons">
            <div className="button-register-box   button-forgot">
                <button
                  className="buttonSubmit-login"
                  type="submit">
                  <FaArrowRight className="arrowRight" /> 
                </button>
            </div>    
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgot;

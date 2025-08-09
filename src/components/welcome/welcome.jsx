import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function WelcomePage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'success') {
      // After a short delay, navigate to login page automatically
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (!status) return <p>Loading...</p>;

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>🎉 Congratulations!</h1>
        <p>Your email has been verified successfully.</p>
        <p>You will be redirected to the login page shortly...</p>
      </div>
    );
  }

  if (status === 'already-verified') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>✅ Email already verified</h1>
        <p>You can now log in.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
      <h1>❌ Verification failed</h1>
      <p>Invalid or expired token.</p>
      <p>Please try again or request a new verification email.</p>
    </div>
  );
}




// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL;

// const Welcome = () => {
//   const { token } = useParams();
//   const [userId, setUserId] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!token) {
//       setError("No token provided.");
//       return;
//     }
//     const verify = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/users/verify/${token}`);
//         if (res.data.userId) {
//           setUserId(res.data.userId);
//         } else {
//           setError("Verification succeeded but no ID returned.");
//         }
//       } catch (err) {
//         setError("Invalid or expired token.");
//       }
//     };
//     verify();
//   }, [token]);

//   return (
//     <div>
//       {error && <p>{error}</p>}
//       {userId && <p>Your unique ID is: <strong>{userId}</strong></p>}
//     </div>
//   );
// };
// export default Welcome;


// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaArrowRight } from "react-icons/fa6";
// import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
// import "./welcome.css";
// const BASE_URL = process.env.REACT_APP_API_URL;



// const Welcome  = () => {
//   const { token } = useParams();
//   const [userId, setUserId] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState("");


// useEffect(() => {
//   const verify = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/users/verify/${token}`);
//       if (res.data.userId) {
//         setUserId(res.data.userId);
//       } else {
//         setError("Verification succeeded but no ID returned.");
//       }
//     } catch (err) {
//   if (err.response && err.response.data && err.response.data.error) {
//     setError(err.response.data.error);
//   } else {
//     setError("Verification failed. Please try again later.");
//   }
// }

//   };
//   verify();
// }, [token]);



//   return (
//     <div className="signup-wrapper">
//        <MdOutlineKeyboardArrowLeft  className="wrapper-arrow-left"/>
//   <div className="paragraphs-welcome-box"> 
//     <h3 className="congratulation-title">Congratulations!</h3>
//       <p className="middle-paragraph">You've successfully signed up for our platform. </p>
//       {error && <p className="error-message">{error}</p>}
//       {userId && (
//       <p className="middle-paragraph id-hyperlink"> Your unique ID is
//          <span  className="link-id">{userId}</span>
//       </p> 
//       )}
//       <p className="middle-paragraph">This ID will be your identifier on our platform, ensuring your privacy and security.</p>

//       <p className="middle-paragraph  info-paragraph">
//         Thank you for joining our community! 
//         Feel free to explore and rate PhD supervisors
//         to contribute to a collaborative and informed academic environment.</p> 
//       </div>
//         <div className="circle-container">  
//            <div className="circle-right"></div>
//               <div className="singup-arrowButton">
//                 <span className="signup"></span>
//                     <button
//                       className="circle-button"
//                       type="submit">
//                       <FaArrowRight className="arrowRight" />
//                     </button>
//                 </div>
//          </div>
//           <div className="">
//               <p className="title-head-signup  title-welcome">You’re Welcome!</p>
//           </div>
//     </div>
//   );
// };

// export default Welcome;

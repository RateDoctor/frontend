import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const Welcome = () => {
  const { token } = useParams();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Verification token missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/verify/${token}`);
        if (res.data.userId) {
          setUserId(res.data.userId);
        } else if (res.data.message) {
          setError(res.data.message);
        } else {
          setError("Verification failed.");
        }
      } catch (err) {
        setError(
          err.response?.data?.error || "Verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h3>Congratulations!</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userId && <p>Your unique ID is <strong>{userId}</strong></p>}
      <p>Thanks for joining our community!</p>
    </div>
  );
};

export default Welcome;


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


// // useEffect(() => {
// //   const verify = async () => {
// //     try {
// //       const res = await axios.get(`${BASE_URL}/api/users/verify/${token}`);
// //       if (res.data.userId) {
// //         setUserId(res.data.userId);
// //       } else {
// //         setError("Verification succeeded but no ID returned.");
// //       }
// //     } catch (err) {
// //   if (err.response && err.response.data && err.response.data.error) {
// //     setError(err.response.data.error);
// //   } else {
// //     setError("Verification failed. Please try again later.");
// //   }
// // }

// //   };
// //   verify();
// // }, [token]);

// useEffect(() => {
//   const verify = async () => {
//     try {
//       console.log("Verifying with token:", token);
//       const res = await axios.get(`https://rate-doctor-a589a6f15d3a.herokuapp.com/api/users/verify/${token}`
// );
//       console.log("Verify response:", res.data);
//       if (res.data.userId) {
//         setUserId(res.data.userId);
//       } else {
//         setError("Verification succeeded but no ID returned.");
//       }
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError("Verification failed. Please try again later.");
//       }
//     }
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

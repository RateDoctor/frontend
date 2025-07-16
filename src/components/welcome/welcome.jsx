import { useEffect, useState } from "react";
// import axios from "axios";
// const BASE_URL = process.env.REACT_APP_API_URL;

const Welcome = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Option 1: Get userId from localStorage if stored on signup
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      // Option 2: Or fetch user info from backend (if you have auth token)
      // axios.get(`${BASE_URL}/api/users/me`)
      //   .then(res => setUserId(res.data.userId))
      //   .catch(() => setError("Unable to load user info."));
      setError("User ID not found.");
    }
  }, []);

  return (
    <div>
      <h3>Congratulations!</h3>
      {error && <p>{error}</p>}
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

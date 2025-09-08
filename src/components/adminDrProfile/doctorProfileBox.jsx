import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import BookmarkButton from '../bookmark/BookmarkButton';
import StarRating from '../starRating/StarRating'; // editable for logged-in user
import AverageStarRating from "../starRating/average/AverageStarRating"; // readonly
import { getAvatar } from "../../utils/getAvatar";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../../layouts/load/load.jsx"; 
import './adminDrProfile.css';

const BASE_URL = process.env.REACT_APP_API_URL;

const DoctorProfileBox = ({ doctorData }) => {
  const navigate = useNavigate(); 
  const [doctorAvgStars, setDoctorAvgStars] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchRatings = async () => {
      if (!doctorData?._id) return;

      setLoading(true);
      try {
        if (token) {
          // Logged-in user → fetch their rating + average
          const res = await axios.get(`${BASE_URL}/api/ratings/${doctorData._id}/my-rating`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserRating(res.data.userRating ?? 0);
          setDoctorAvgStars(res.data.averageRating ?? 0);
        } else {
          // Guest → fetch only average
          const avgRes = await axios.get(`${BASE_URL}/api/ratings/average-ratings`);
          const doctorAvg = avgRes.data.find(item => item._id === doctorData._id);
          setDoctorAvgStars(doctorAvg ? doctorAvg.avgStars : 0);
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        Swal.fire("Error", "Failed to load ratings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [doctorData, token]);

  const handleRateClick = () => {
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in before rating a doctor.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    navigate(`/my-ratings/${doctorData._id}`);
  };

  if (loading) {
    return (
      <div className="drProfile-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Loader type={1} />
      </div>
    );
  }

  if (!doctorData) return <div>No doctor data available</div>;

  return (
    <div className="drProfile-box">
      <div className="drProfile-left">
        <img
          className='imgProfile'
          src={doctorData.profileImage?.fileUrl || getAvatar(doctorData.gender)}
          alt={doctorData.name}
        />
      </div>

      <div className="drProfile-right">
        <div className="rating-stars">
          {token ? (
            <StarRating
              rating={userRating}       // user rating
              doctorId={doctorData._id}
              token={token}
              editable={true}           // allow editing
              onRatingSaved={(newRating) => setUserRating(newRating)}
            />
          ) : (
            <AverageStarRating rating={doctorAvgStars} /> // readonly for guests
          )}
          <span className='overallRating'>Overall rating</span>
        </div>

        <div className="name-and-bookmark">
          <h2 className="admin-doctor-name">{doctorData.name}</h2>
          <BookmarkButton doctor={{
            id: doctorData._id,
            name: doctorData.name,
            image: doctorData.image || "",
            gender: doctorData.gender || "",
          }} />
        </div>

        <p className="doctor-fields">
          {doctorData.teaching ? doctorData.teaching.join(", ") : "No teaching information available"}
        </p>

        <button className="rate-btn" onClick={handleRateClick}>
          <span className='rate-button-span'>Rate</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorProfileBox;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';  
// import BookmarkButton from '../bookmark/BookmarkButton';
// import StarRating from '../starRating/StarRating';
// import { getAvatar } from "../../utils/getAvatar";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Loader from "../../layouts/load/load.jsx"; 
// import './adminDrProfile.css';
// const BASE_URL = process.env.REACT_APP_API_URL;

// const DoctorProfileBox = ({ doctorData }) => {
//   const navigate = useNavigate(); 
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [doctorAvgStars, setDoctorAvgStars] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("authToken");

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const [feedbackRes, avgRes] = await Promise.all([
//   //         axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } }),
//   //         axios.get(`${BASE_URL}/api/ratings/average-ratings`, { headers: { Authorization: `Bearer ${token}` } })
//   //       ]);

//   //       setFeedbacks(feedbackRes.data || []);

//   //       const doctorAvg = avgRes.data.find(item => item._id === doctorData._id);
//   //       setDoctorAvgStars(doctorAvg ? doctorAvg.avgStars : 0);
//   //     } catch (err) {
//   //       console.error("Error fetching feedbacks or averages:", err);
//   //       Swal.fire("Error", "Failed to load data", "error");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   if (doctorData?._id) fetchData();
//   // }, [doctorData, token]);



//   useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // 1. Feedbacks (protected, need login)
//       const feedbackPromise = token
//         ? axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } })
//         : Promise.resolve({ data: [] });

//       // 2. Average ratings (public, no login required)
//       const avgPromise = axios.get(`${BASE_URL}/api/ratings/average-ratings`);

//       const [feedbackRes, avgRes] = await Promise.all([feedbackPromise, avgPromise]);

//       setFeedbacks(feedbackRes.data || []);

//       const doctorAvg = avgRes.data.find(item => item._id === doctorData._id);
//       setDoctorAvgStars(doctorAvg ? doctorAvg.avgStars : 0);
//     } catch (err) {
//       console.error("Error fetching feedbacks or averages:", err);
//       Swal.fire("Error", "Failed to load data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (doctorData?._id) fetchData();
// }, [doctorData, token]);

//   // const handleRateClick = () => {
//   //   navigate(`/my-ratings/${doctorData._id}`);
//   // };

//   const handleRateClick = () => {
//   if (!token) {
//     Swal.fire({
//       title: "Login Required",
//       text: "You need to log in before rating a doctor.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Login",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigate("/login");
//       }
//     });
//     return;
//   }

//   // If logged in, proceed to rating page
//   navigate(`/my-ratings/${doctorData._id}`);
// };


//   // Centered loader in the middle of the component
//   if (loading) {
//     return (
//       <div className="drProfile-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
//         <Loader type={1} />
//       </div>
//     );
//   }

//   if (!doctorData) return <div>No doctor data available</div>;

//   return (
//     <div className="drProfile-box">

//        <div className="drProfile-left">
//              <img
//                     className='imgProfile'
//                     src={
//                       doctorData.profileImage?.fileUrl || getAvatar(doctorData.gender)
//                     }
//                     alt={doctorData.name}
//                   />

//       </div>


//       <div className="drProfile-right">
//         <div className="rating-stars">
//           <StarRating 
//             rating={Number(doctorAvgStars)}  
//             editable={false}                 
//           />
//           <span className='overallRating'>Overall rating</span>
//         </div>

//         <div className="name-and-bookmark">
//           <h2 className="admin-doctor-name">{doctorData.name}</h2>
//           <BookmarkButton doctor={{
//             id: doctorData._id,
//             name: doctorData.name,
//             image: doctorData.image || "",
//             gender: doctorData.gender || "",
//           }} />
//         </div>

//         <p className="doctor-fields">
//           {doctorData.teaching ? doctorData.teaching.join(", ") : "No teaching information available"}
//         </p>

//         <button className="rate-btn" onClick={handleRateClick}>
//           <span className='rate-button-span'>Rate</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DoctorProfileBox;



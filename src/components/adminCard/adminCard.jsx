import React, { useState, useEffect } from "react";
import './adminCard.css';
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../../utils/getAvatar";
import EditableStarRating from '../starRating/StarRating';
import axios from "axios";

const AdminCard = ({ doctorId, name, rating: initialRating, university, field, topics, gender, image }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [rating, setRating] = useState(initialRating || 0);

  // Fetch latest rating for this doctor by current user
  useEffect(() => {
  const fetchRating = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ratings/${doctorId}/my-rating`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(res.data.stars || 0);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRating(0); // No rating yet
      } else {
        console.error("Failed to fetch rating:", err);
      }
    }
  };
  fetchRating();
}, [doctorId, token]);


  const handleCardClick = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate(`/admin-dr-profile/${doctorId}`);
    } else {
      navigate(`/my-ratings/${doctorId}`);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="admin-card" onClick={handleCardClick}>
      <img src={getAvatar(gender, image)} alt={name} className="doctor-img" />
      <div className="info">
        <h3>{name}</h3>
        <div className="parent-paragraphs">
          {/* Star rating */}
        <div className="rating" onClick={(e) => e.stopPropagation()}>
            <EditableStarRating
              rating={rating}
              doctorId={doctorId}
              token={token}
              onRatingSaved={(newRating) => setRating(newRating)}
            />
          </div>





          <p className="university">
            {university?._id ? (
              <span
                onClick={(e) => { e.stopPropagation(); navigate(`/university/${university._id}`); }}
                style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
                title="View University"
              >
                {university.name}
              </span>
            ) : (
              university || "No university"
            )}
          </p>

          <p className="field">{field?.name || field || "No field"}</p>

          <p className="topics">
            {Array.isArray(topics) && topics.length > 0
              ? topics.map(t => capitalize(typeof t === "string" ? t : t.name || "")).join(", ")
              : <span>No topic</span>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;




// import React from "react";
// import './adminCard.css'
// import { useNavigate } from "react-router-dom";
// import { getAvatar } from "../../utils/getAvatar";
// import StarRating from '../starRating/StarRating';  // remove this import


// const AdminCard = ({ doctorId, name, rating, university, field, topics,gender, image}) => {
// const navigate = useNavigate();





//   // Handle card click
//   const handleCardClick = () => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole === "admin") {
//       navigate(`/admin-dr-profile/${doctorId}`);
//     } else {
//       navigate(`/my-ratings/${doctorId}`);
//     }
//   };

//  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
//    return (
//     <div className="admin-card" onClick={handleCardClick}>
//       {/* <img src={image} alt={name} className="doctor-img" /> */}
//       <img
//         src={getAvatar(gender, image)}
//         alt={name}
//         className="doctor-img"
//       />
//       {/* <BookmarkButton doctor={{ id: doctorId, name, image, gender }} /> */}
//       <div className="info">
//         <h3>{name}</h3>
//         <div className="parent-paragraphs">
//           <p className="rating"><StarRating rating={rating} /></p>
//           <p className="university">
//               {typeof university === 'object' && university?._id ? (
//                 <span
//                   onClick={e => {
//                     e.stopPropagation();   
//                     navigate(`/university/${university._id}`);
//                   }}
//                   style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
//                   title="View University"
//                 >
//                   {university.name}
//                 </span>
//               ) : (
//                 university || "No university"
//               )}
//             </p>
//           <p className="field">{typeof field === 'object' ? field?.name : field || "No field"}</p>
//           <p className="topics">
//             {Array.isArray(topics) && topics.length > 0
//               ? topics
//                   .map(t => {
//                     const topicName = typeof t === "string" ? t : t.name || "";
//                     return capitalize(topicName);
//                   })
//                   .join(", ")
//               : <span>No topic</span>
//             }
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminCard;

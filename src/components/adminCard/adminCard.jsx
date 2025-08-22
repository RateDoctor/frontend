import React, { useState, useEffect } from "react";
import './adminCard.css';
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../../utils/getAvatar";
import EditableStarRating from '../starRating/StarRating';
import AverageStarRating from "../starRating/average/AverageStarRating";
import axios from "axios";

const AdminCard = ({ doctorId, name, university, field, topics, gender, image }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/ratings/${doctorId}/my-rating`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRating(res.data.userRating ?? 0);
        setAverageRating(res.data.averageRating ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
  }, [doctorId, token]);

  const handleCardClick = () => {
    navigate(`/admin-dr-profile/${doctorId}`);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (loading) return null;

  return (
    <div className="admin-card" onClick={handleCardClick}>
      <img src={getAvatar(gender, image)} alt={name} className="doctor-img" />
      <div className="info">
        <h3>{name}</h3>

        <div className="rating-section" onClick={(e) => e.stopPropagation()}>
          <div className="user-rating">
            <EditableStarRating
              rating={userRating}
              doctorId={doctorId}
              token={token}
              editable={true}
              onRatingSaved={(newRating) => setUserRating(newRating)}
            />
          </div>

          <div className="average-rating">
            <AverageStarRating rating={averageRating} /> <span className="average-label">average</span>
          </div>
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
  );
};

export default AdminCard;



// import React, { useState, useEffect } from "react";
// import './adminCard.css';
// import { useNavigate } from "react-router-dom";
// import { getAvatar } from "../../utils/getAvatar";
// import EditableStarRating from '../starRating/StarRating';
// import axios from "axios";

// const AdminCard = ({ doctorId, name, rating: initialRating, university, field, topics, gender, image }) => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("authToken");

//   const [rating, setRating] = useState(null); // initially null, not 0
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRating = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/ratings/${doctorId}/my-rating`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setRating(res.data.stars ?? initialRating ?? 0); // backend first, fallback to initialRating
//       } catch (err) {
//         if (err.response?.status === 404) setRating(initialRating ?? 0);
//         else {
//           console.error(err);
//           setRating(initialRating ?? 0);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRating();
//   }, [doctorId, initialRating, token]);

//   const handleCardClick = () => {
//     const userRole = localStorage.getItem("userRole");
//     navigate(userRole === "admin" ? `/admin-dr-profile/${doctorId}` : `/my-ratings/${doctorId}`);
//   };

//   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//   if (loading) return null; // don't render card until rating is ready

//   return (
//     <div className="admin-card" onClick={handleCardClick}>
//       <img src={getAvatar(gender, image)} alt={name} className="doctor-img" />
//       <div className="info">
//         <h3>{name}</h3>
//         <div className="parent-paragraphs">
//           <div className="rating" onClick={(e) => e.stopPropagation()}>
//             <EditableStarRating
//               rating={rating}
//               doctorId={doctorId}
//               token={token}
//               editable={true}
//               onRatingSaved={(newRating) => setRating(newRating)}
//             />
//           </div>
//           <p className="university">
//             {university?._id ? (
//               <span
//                 onClick={(e) => { e.stopPropagation(); navigate(`/university/${university._id}`); }}
//                 style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
//                 title="View University"
//               >
//                 {university.name}
//               </span>
//             ) : (
//               university || "No university"
//             )}
//           </p>
//           <p className="field">{field?.name || field || "No field"}</p>
//           <p className="topics">
//             {Array.isArray(topics) && topics.length > 0
//               ? topics.map(t => capitalize(typeof t === "string" ? t : t.name || "")).join(", ")
//               : <span>No topic</span>
//             }
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminCard;
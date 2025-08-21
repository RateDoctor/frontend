import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const EditableStarRating = ({ rating: parentRating = 0, doctorId, token, onRatingSaved }) => {
  const [rating, setRating] = useState(parentRating);
  const [hover, setHover] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal rating when parentRating changes
  useEffect(() => {
    setRating(parentRating);
  }, [parentRating]);

  const handleClick = async (value) => {
    setRating(value);         // optimistic update
    onRatingSaved?.(value);   // immediate UI update
    setIsSaving(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ratings/star`,
        { doctorId, stars: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(res.data.stars);
      onRatingSaved?.(res.data.stars);
    } catch (err) {
      console.error("Failed to save rating:", err);
      setRating(parentRating); // revert if failed
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, position: "relative", minWidth: 90 }}>
      {[1, 2, 3, 4, 5].map((star) => {
      const icon = star <= rating ? faStar : faStarHalfAlt;
      return (
        <FontAwesomeIcon
          key={star}
          icon={icon}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => { e.stopPropagation(); handleClick(star); }}
          style={{
            cursor: "pointer",
            color: "#0074E4",
            fontSize: 14,
            flexShrink: 0,
            width: 16,
            textAlign: "center",
          }}
        />
      );
    })}

      {/* rating number */}
      <span style={{ fontSize: 12, color: "#0074E4", marginLeft: -8, width: 25, textAlign: "right" }}>
        {rating.toFixed(1)}
      </span>

      {/* Saving text - absolute, does not expand width */}
      {isSaving && (
        <span style={{ position: "absolute", right: -50, fontSize: 12, color: "#0074E4" }}>
          Saving...
        </span>
      )}
    </div>
  );
};

export default EditableStarRating;



// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

// import axios from "axios";

// const EditableStarRating = ({ rating: parentRating = 0, doctorId, token, onRatingSaved }) => {
//   const [rating, setRating] = useState(parentRating);
//   const [hover, setHover] = useState(0);
//   const [isSaving, setIsSaving] = useState(false);

//   // Keep internal rating in sync with parent prop
//   useEffect(() => {
//     setRating(parentRating);
//   }, [parentRating]);

//   const handleClick = async (value) => {
//     setRating(value); // Optimistic UI update
//     setIsSaving(true);

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/ratings/star`,
//         { doctorId, stars: value },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setRating(res.data.stars);
//       onRatingSaved?.(res.data.stars);
//     } catch (err) {
//       console.error("Failed to save star rating:", err);
//       alert("Could not save rating. Try again.");
//       setRating(parentRating); // revert on failure
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//   <div style={{
//   display: "inline-flex",
//   alignItems: "center",
//   gap: 4,
//   flexShrink: 0,
//   width: "fit-content", //     
// }}>
//   {[1, 2, 3, 4, 5].map((star) => {
//   const icon = star <= rating ? faStar : faStarHalfAlt;
//   return (
//     <FontAwesomeIcon
//       key={star}
//       icon={icon}
//       onMouseEnter={() => setHover(star)}
//       onMouseLeave={() => setHover(0)}
//       onClick={(e) => { e.stopPropagation(); handleClick(star); }}
//       style={{
//         cursor: "pointer",
//         color: "#0074E4",
//         fontSize: 14,
//         flexShrink: 0,
//         width: 16,
//         textAlign: "center",
//       }}
//     />
//   );
// })}



//   <span style={{
//     fontSize: 12,
//     color: "#0074E4",
//     marginLeft: -14,
//     flexShrink: 0,         
//     width: 35,            
//     textAlign: "right",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis"
//   }}>
//     {rating.toFixed(1)}{isSaving ? " Saving..." : ""}
//   </span>
// </div>

//   );
// };

// export default EditableStarRating;
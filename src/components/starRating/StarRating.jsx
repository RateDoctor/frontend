import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

const EditableStarRating = ({ rating: parentRating = 0, doctorId, token, onRatingSaved }) => {
  const [rating, setRating] = useState(parentRating);
  const [hover, setHover] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Keep internal rating in sync with parent prop
  useEffect(() => {
    setRating(parentRating);
  }, [parentRating]);

  const handleClick = async (value) => {
    setRating(value); // Optimistic UI update
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
      console.error("Failed to save star rating:", err);
      alert("Could not save rating. Try again.");
      setRating(parentRating); // revert on failure
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  flexShrink: 0,  }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={star <= (hover || rating) ? faStar : faStarHalfAlt}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleClick(star)}
          style={{ cursor: "pointer", color: "#0074E4", fontSize: 14 }}
        />
      ))}
      {isSaving && <span style={{ marginLeft: -4, fontSize: 12 }}>Saving...</span>}
      <span style={{ marginLeft: 4,
                    fontSize: 12,
                    color: "#0074E4",        // new color for the rating number
                    minWidth: 25,             // prevents card width jump
                    textAlign: "right" }}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default EditableStarRating;






// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

// const StarRating = ({ rating }) => {
//   if (typeof rating !== "number" || isNaN(rating)) {
//     return <span>No rating available</span>;
//   }

//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

//   return (
//     <span className="star-display" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
//       {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon icon={faStar} key={`full-${i}`} />)}
//       {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
//       {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon icon={faStarOutline} key={`empty-${i}`} />)}
//       <span className="five-star">({rating.toFixed(1)}/5)</span>
//     </span>
//   );
// };

// export default StarRating;



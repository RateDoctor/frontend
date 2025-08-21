import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const StarRating = ({ initialRating = 0, doctorId, token, onRatingSaved }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleClick = async (value) => {
    setRating(value);
    setSaving(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ratings/star`,
        { doctorId, stars: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRatingSaved?.(res.data.stars); // update parent if needed
    } catch (err) {
      console.error('Failed to save stars:', err);
      alert('Failed to save rating');
    } finally {
      setSaving(false);
    }
  };

  const displayRating = hoverRating || rating;
  const fullStars = Math.floor(displayRating);
  const halfStar = displayRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon
          icon={faStar}
          key={`full-${i}`}
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(i + 1)}
          className="star clickable"
        />
      ))}
      {halfStar && (
        <FontAwesomeIcon
          icon={faStarHalfAlt}
          onMouseEnter={() => setHoverRating(fullStars + 0.5)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(fullStars + 0.5)}
          className="star clickable"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesomeIcon
          icon={faStarOutline}
          key={`empty-${i}`}
          onMouseEnter={() => setHoverRating(fullStars + (halfStar ? 1 : 0) + i + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(fullStars + (halfStar ? 1 : 0) + i + 1)}
          className="star clickable"
        />
      ))}
      <span className="five-star">({rating.toFixed(1)}/5)</span>
      {saving && <span className="saving-text">Saving...</span>}
    </div>
  );
};

export default StarRating;


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



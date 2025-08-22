import React from "react";
import '../average/AverageStarRating.css';

const AverageStarRating = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="average-rating-container">
      <div className="stars">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="star full">&#9733;</span>
        ))}
        {halfStar && <span className="star half">&#9733;</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="star empty">&#9733;</span>
        ))}
      </div>
      <span className="rating-text">{rating.toFixed(1)}</span>
    </div>
  );
};

export default AverageStarRating;

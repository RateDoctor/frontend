import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating }) => {
  if (typeof rating !== "number" || isNaN(rating)) {
    return <span>No rating available</span>;
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="star-display" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon icon={faStar} key={`full-${i}`} />)}
      {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} />}
      {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon icon={faStarOutline} key={`empty-${i}`} />)}
      <span className="five-star">({rating.toFixed(1)}/5)</span>
    </span>
  );
};

export default StarRating;

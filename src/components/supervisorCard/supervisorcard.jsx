import React from "react";

import './supervisorcard.css'

const SupervisorCard = ({ name, rating, university, field, topics, image }) => {
  const renderStars = (rating) => {

    if (typeof rating !== "number" || isNaN(rating)) {
    return (
      <span className="star-display">
        No rating available
      </span>
    );
   }

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="star-display">
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
        <span className="five-star" >
          ({rating.toFixed(1)}/5)
        </span>
      </span>
    );
  };

  return (
    <div className="supervisor-card">
      <img src={image} alt={name} className="doctor-img" />
      <div className="info">
        <h3>{name}</h3>
        <div className="parent-paragraphs">
        <p className="rating">{renderStars(rating)}</p>
        <p className="university">{university}</p>
        <p className="field">{field}</p>
        <p className="topics">{Array.isArray(topics) ? topics.join(", ") : "No topics available"}</p>

        </div>
       
      </div>
    </div>
  );
};

export default SupervisorCard;

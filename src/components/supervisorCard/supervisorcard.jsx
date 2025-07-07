import React from "react";

import './supervisorcard.css'

const SupervisorCard = ({ name, rating, university, field, topics, image, onClick }) => {
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
    <div className="supervisor-card"  onClick={onClick}>
      <img src={image} alt={name} className="doctor-img" />
      <div className="info">
        <h3>{name}</h3>
        <div className="parent-paragraphs">
        <p className="rating">{renderStars(rating)}</p>

        <p className="university">{typeof university === 'object' ? university?.name : university || "No university"}</p>
        <p className="field">{typeof field === 'object' ? field?.name : field || "No field"}</p>
        <p className="topics">
          {Array.isArray(topics) && topics.length > 0 ? (
            topics
              .map((t) => {
                const topic = typeof t === "string" ? t : t.name;
                return topic.charAt(0).toUpperCase() + topic.slice(1);
              })
              .join(', ')
          ) : (
            <span>No topic</span>
          )}
        </p>






        </div>
       
      </div>
    </div>
  );
};

export default SupervisorCard;

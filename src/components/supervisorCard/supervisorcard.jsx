import React from "react";

import './supervisorcard.css'

const SupervisorCard = ({ name, rating, university, field, topics, image }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="star-display">
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
        <span style={{ marginLeft: "4px", color: "#0074E4", fontSize: "13px" }}>
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
        <p className="rating">{renderStars(rating)}</p>
        <p>{university}</p>
        <p>{field}</p>
        <p className="topics">{topics.join(", ")}</p>
      </div>
    </div>
  );
};

export default SupervisorCard;

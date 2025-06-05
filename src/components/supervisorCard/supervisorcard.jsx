import React from "react";

const SupervisorCard = ({ name, rating, university, field, topics, image }) => {
  return (
    <div className="supervisor-card">
      <img src={image} alt={name} className="doctor-img" />
      <div className="info">
        <h3>{name}</h3>
        <p className="rating">Rating: {rating} ★</p>
        <p>{university}</p>
        <p>{field}</p>
        <p className="topics">{topics.join(", ")}</p>
      </div>
    </div>
  );
};

export default SupervisorCard;

import React from "react";
import './supervisorcard.css'
import { useNavigate } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';



const SupervisorCard = ({ doctorId, name, rating, university, field, topics, image, gender }) => {
const navigate = useNavigate();

const getAvatar = () => {
  console.log("Gender:", gender, "Image:", image);
  if (image) return image;

  if (gender === "female" || gender === "woman") {
    return female;
  } else if (gender === "male" || gender === "man") {
    return man;
  } else {
    return defaultAvatar;
  }
};


const handleCardClick = () => {
const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role === "supervisor") {
    navigate(`/supervisor-dr-profile/${doctorId}`);
  } else {
    navigate(`/my-ratings/${doctorId}`);
  }
};

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

   return (
    <div className="supervisor-card" onClick={handleCardClick}>
      {/* <img src={image} alt={name} className="doctor-img" /> */}
      <img
        src={getAvatar()}
        alt={name}
        className="doctor-img"
      />
      <div className="info">
        <h3>{name}</h3>
        <div className="parent-paragraphs">
          <p className="rating"><StarRating rating={rating} /></p>
          <p className="university">
              {typeof university === 'object' && university?._id ? (
                <span
                  onClick={e => {
                    e.stopPropagation();   
                    navigate(`/university/${university._id}`);
                  }}
                  style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
                  title="View University"
                >
                  {university.name}
                </span>
              ) : (
                university || "No university"
              )}
            </p>
          <p className="field">{typeof field === 'object' ? field?.name : field || "No field"}</p>
          <p className="topics">
            {Array.isArray(topics) && topics.length > 0
              ? topics.map(t => {
                  const topic = typeof t === "string" ? t : t.name;
                  return topic.charAt(0).toUpperCase() + topic.slice(0,4);
                }).join(", ")
              : <span>No topic</span>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupervisorCard;

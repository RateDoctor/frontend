import React, { useState } from 'react';
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
import { renderStars } from "../../utils/renderStars"; 
import './supervisorDrProfile.css'; 

const DoctorProfileBox = ({ doctorData }) => {
  const [bookmarked, setBookmarked] = useState(false);

  if (!doctorData) {
    return <div>Loading doctor data...</div>;
  }

  return (
    <div className="drProfile-box">
      <div className="drProfile-left">
        <img src="../../imgs/men-muslim.jpeg" alt="doctor" className="doctor-image" />
      </div>

      <div className="drProfile-right">


        <div className="rating-stars">   {renderStars(doctorData.rating)} <span>(3/5) </span>  <span className='overallRating'>Overall rating</span></div>

        <div className="name-and-bookmark">
          <h2 className="doctor-name">{doctorData.doctorName}</h2>

          <button 
            className="bookmark-button" 
            onClick={() => setBookmarked(!bookmarked)} 
            aria-label={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            {bookmarked ? <CiBookmarkCheck /> : <CiBookmarkPlus />}
          </button>
        </div>

        <p className="doctor-fields">Artificial Intelligence, Machine Learning</p>

        <button className="rate-btn">Rate</button>
      </div>
    </div>
  );
};

export default DoctorProfileBox;

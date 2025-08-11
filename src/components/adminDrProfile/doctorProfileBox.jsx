// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import BookmarkButton from '../bookmark/BookmarkButton'; // Import your reusable button
// import { renderStars } from "../../utils/renderStars";
import StarRating from '../starRating/StarRating';
import { getAvatar } from "../../utils/getAvatar";  // ✅ Import the avatar utility
import './adminDrProfile.css';

const DoctorProfileBox = ({ doctorData }) => {
   const navigate = useNavigate(); 


  const handleRateClick = () => {
    // navigate to rating page, passing doctor id in URL or as state
    navigate(`/my-ratings/${doctorData._id}`);
  };

  if (!doctorData) {
    return <div>Loading doctor data...</div>;
  }

  const teachingFields = doctorData.teaching ? doctorData.teaching.join(", ") : "No teaching information available";

  return (
    <div className="drProfile-box">
      <div className="drProfile-left">
        <img
          className='imgProfile'
          src={getAvatar(doctorData.gender, doctorData.image)}  // ✅ Dynamic Avatar
          alt={doctorData.name}
        />
      </div>

      <div className="drProfile-right">
        <div className="rating-stars">
          {/* {renderStars(Number(doctorData?.rating ?? 0))} */}
           <StarRating rating={Number(doctorData?.rating ?? 0)} />
          <span className='overallRating'>Overall rating</span>
        </div>

        <div className="name-and-bookmark">
          <h2 className="admin-doctor-name">{doctorData.name}</h2>

           <BookmarkButton doctor={{
            id: doctorData._id,
            name: doctorData.name,
            image: doctorData.image || "",
            gender: doctorData.gender || "",
          }} />
        </div>

        <p className="doctor-fields">{teachingFields}</p>

        {/* <button className="rate-btn"><span className='rate-button-span'>Rate</span></button> */}

        <button className="rate-btn" onClick={handleRateClick}>
          <span className='rate-button-span'>Rate</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorProfileBox;

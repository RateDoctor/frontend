import React, { useState } from 'react';
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
import { renderStars } from "../../utils/renderStars"; 
import imageDrSupervisor from "../../imgs/men-muslim.jpeg";
import './supervisorDrProfile.css';

const DoctorProfileBox = ({ doctorData }) => {
  const [bookmarked, setBookmarked] = useState(false);

  if (!doctorData) {
    return <div>Loading doctor data...</div>;
  }

  // Check if doctorData.teaching exists and join it into a string if it's an array
  const teachingFields = doctorData.teaching ? doctorData.teaching.join(", ") : "No teaching information available";


  return (
    <div className="drProfile-box">
      <div className="drProfile-left">
        <img className='imgProfile' src={imageDrSupervisor} alt="Supervisor" />
      </div>

      <div className="drProfile-right">
        <div className="rating-stars">
          {renderStars(Number(doctorData?.rating ?? 0))}  {/* Render stars based on rating */}
          <span className='overallRating'>Overall rating</span>
        </div>

        <div className="name-and-bookmark">
          <h2 className="superVisor-doctor-name">{doctorData.name}</h2>  {/* Display doctor name */}

          <button 
            className="bookmark-button" 
            onClick={() => setBookmarked(!bookmarked)} 
            aria-label={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            {bookmarked ? <CiBookmarkCheck /> : <CiBookmarkPlus />}
          </button>
        </div>

        <p className="doctor-fields">{teachingFields}</p>  {/* Display teaching fields */}

        <button className="rate-btn"><span className='rate-button-span'>Rate</span></button>
      </div>
    </div>
  );
};

export default DoctorProfileBox;

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import searchBard from '../searchBar/searchBar';

import { renderStars } from "../../utils/renderStars"; 
import imageDrSupervisor from "../../imgs/university.png";
import './universityPage.css'; 
import { doctorData } from '../supervisorDrProfile/data';
import Navbar from "../navbar/navbar";


const UniversityProfile = () => {
  const navigate = useNavigate();

  if (!doctorData) {
    return <div>Loading doctor data...</div>;
  }

  return (
<div className='universityProfile-parent-box'>
     <Navbar
            title="Explore"
            onBack={() => {
             if (window.history.length > 2) {
            navigate(-1);
              } else {
            navigate("/");
          }
        }}
      />
   <div className="universityProfile-box">
      <div className="universityProfile-left">
      <img className='universityImgProfile' src={imageDrSupervisor} alt="Supervisor" />
      </div>

      <div className="drProfile-right">


      <div className="rating-stars">
        {renderStars(Number(doctorData?.rating ?? 0)) }
        <span className='overallRating'>Overall rating</span>
      </div>


        <div className="name-and-bookmark">
          <h2 className="superVisor-doctor-name">{doctorData.universityName}</h2>

        </div>

        <p className="university-fields">Paris, France</p>
        <h5 className='phone-university'>Phone: <span>+33 1 40 46 22 11</span></h5>
        <button className="uni-rate-btn"><span className='rate-button-university-span'>Rate</span></button>
      </div>
   
    </div>
      <h5>Phd Doctors</h5>
       <SearchBar
         placeholder="Search Doctors..."
          onSearch={(val) => {
            handleSearch(val);
            setIsSearchFocused(true);
            setViewState("filterDoctors");
          }}
            onFocus={() => {
            setIsSearchFocused(true);
            setViewState("filterDoctors"); // Show list immediately
            handleSearch("");
          }}
          value={query}
        />
</div>
 
  );
};

export default UniversityProfile;

import React from "react";
import SupervisorCard from "../supervisorCard/supervisorcard";
import { FiArrowLeft, FiSearch, FiMoreVertical, FiUsers, FiInfo } from "react-icons/fi";
import "../explore/explore.css";
import doctorImg from "../../imgs/rateLogo.png";

import Navbar from "../navbar/navbar";


const supervisors = [
  {
    name: "Mr. Olivia Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Madeline Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Mr. Olivia Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Madeline Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Mr. Olivia Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Madeline Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Mr. Olivia Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Madeline Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
];

const Explore = () => {
  return (
    <div className="explore-container">
      {/* Navbar */}
    <Navbar title="Explore" onBack={() => console.log("Go Back")} />


      {/* Search Bar */}
      <div className="search-bar">
        <FiSearch className="icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Header Section */}
      <div className="header-text">
        <h2>Rate Your PhD Experience:<br />Explore and Evaluate Supervisors</h2>
        <p>Explore PhD Supervisors and share your academic experiences by rating your PhD supervisor</p>
      </div>

      {/* Cards Grid */}
      <div className="scrollable-section">
         <div className="card-grid">
            {supervisors.map((sup, index) => (
            <SupervisorCard key={index} {...sup} />
            ))}
         </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <FiSearch className="icon" />
        <FiUsers className="icon" />
        <FiInfo className="icon" />
      </footer>
    </div>
  );
};

export default Explore;

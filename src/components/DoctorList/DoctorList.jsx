// src/components/doctorList/DoctorList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import "./doctorList.css";

const DoctorList = ({ doctors, onSelect }) => {
    
  const navigate = useNavigate();

  return (
    <ul className="doctor-list">
      {doctors.map((doc, index) => (
        <li
          key={index}
          onClick={() => {
            if (onSelect) onSelect(); // close overlay, etc.
            navigate(`/doctor/${doc.name}`);
          }}
          className="lists"
        >
          <img src={doc.image} alt={doc.name} className="doctor-list-img" />
          {doc.name}
        </li>
      ))}
    </ul>
  );
};

export default DoctorList;

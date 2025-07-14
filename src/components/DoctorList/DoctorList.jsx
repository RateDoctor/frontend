import React from "react";
import { useNavigate } from "react-router-dom";
import "./doctorList.css"; // Use this for custom styling

const DoctorList = ({ doctors, onSelect, getAvatarForDoctor }) => {
  const navigate = useNavigate();

  return (
    <ul className="doctor-list">
      {doctors.map((doc, index) => (
        <li
          key={index}
          onClick={() => {
            if (onSelect) onSelect();
            navigate(`/my-ratings/${doc._id}?new=true`);
          }}
          className="lists doctor-item"
        >
          <span className="doctor-rank">{doc.rank}</span>
          {/* <img src={doc.image} alt={doc.name} className="doctor-list-img" /> */}

          <img
            src={getAvatarForDoctor ? getAvatarForDoctor(doc) : doc.image}
            alt={doc.name || "Doctor Avatar"}
            className="doctor-list-img"
          />
          <span className="doctor-name">{doc.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default DoctorList;

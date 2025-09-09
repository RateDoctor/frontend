import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";
import "./savedDoctors.css";

const SavedDoctors = ({name, gender, image}) => {
  const navigate = useNavigate();
  const [savedDoctors, setSavedDoctors] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedDoctors")) || [];
    setSavedDoctors(saved);
  }, []);


const getAvatarForDoctor = (doctor) => {
  if (!doctor) return defaultAvatar;

  if (doctor.profileImage && doctor.profileImage.fileUrl) {
    return doctor.profileImage.fileUrl;
  }

  if (doctor.gender === "female" || doctor.gender === "woman") {
    return female;
  } else if (doctor.gender === "male" || doctor.gender === "man") {
    return man;
  }

  return defaultAvatar;
};

  const handleRemove = (id) => {
    const updated = savedDoctors.filter((doctor) => doctor.id !== id);
    setSavedDoctors(updated);
    localStorage.setItem("savedDoctors", JSON.stringify(updated));
  };

  return (
    <div className="saved-doctors-container">
      <div className="saved-doctors-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>Saved Doctors</h2>
      </div>

      <div className="doctors-list">
        {savedDoctors.length === 0 && <p>No saved doctors yet.</p>}
        {savedDoctors.map((doctor,doc) => (
          <div key={doctor.id} className="doctor-item">
            {/* <img src={doctor.image} alt={doctor.name} className="doctor-image" /> */}
           <img
              src={getAvatarForDoctor(doctor)}
              alt={doctor.name || "Doctor Avatar"}
              className="doctor-img"
            />
            <span className="doctor-name">{doctor.name}</span>
            <button className="remove-button" onClick={() => handleRemove(doctor.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedDoctors;


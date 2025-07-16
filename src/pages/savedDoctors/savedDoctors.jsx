import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./savedDoctors.css";

const SavedDoctors = () => {
  const navigate = useNavigate();
  const [savedDoctors, setSavedDoctors] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedDoctors")) || [];
    setSavedDoctors(saved);
  }, []);

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
        {savedDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-item">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
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


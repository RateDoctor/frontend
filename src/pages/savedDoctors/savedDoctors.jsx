import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./savedDoctors.css";

const savedDoctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 2,
    name: "Dr. Michael Lee",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 3,
    name: "Dr. Aisha El-Masri",
    image: "https://via.placeholder.com/60",
  },
];

const SavedDoctors = () => {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    alert(`Remove doctor with id ${id}`);
    // Add actual remove logic here
  };

  return (
    <div className="saved-doctors-container">
      <div className="saved-doctors-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>Saved Doctors</h2>
      </div>

      <div className="doctors-list">
        {savedDoctorsData.map((doctor) => (
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

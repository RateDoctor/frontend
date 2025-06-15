import React from "react";
// import "./performanceSection.css";

const PerformanceSection = ({ title = "Edit Performance", doctorName = "Tomas" }) => {
  const categories = ["Communication", "Support", "Guidance", "Availability"];
  const options = [
    { label: "Excellent", emoji: "😄" },
    { label: "Good", emoji: "🙂" },
    { label: "Fair", emoji: "😐" },
    { label: "Poor", emoji: "😞" },
  ];

  return (
    <div className="performance-section">
      <h4>{title || `Edit ${doctorName}’s Performance`}</h4>
      {categories.map((category) => (
        <div key={category} className="rating-category">
          <label>{category}</label>
          <div className="rating-options">
            {options.map((option) => (
              <div key={option.label} className="rating-option">
                <div className="emoji">{option.emoji}</div>
                <div className="label">{option.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceSection;

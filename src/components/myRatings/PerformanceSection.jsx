import React from "react";

const PerformanceSection = ({
  title = "Edit Performance",
  doctorName = "Tomas",
  hideTitle = false,
  showPercentage = false,
}) => {
  const categories = ["Communication", "Support", "Guidance", "Availability"];
  const options = [
    { label: "Excellent", emoji: "😄" , percent: "40%" },
    { label: "Good", emoji: "🙂", percent: "58%" },
    { label: "Fair", emoji: "😐", percent: "89%" },
    { label: "Poor", emoji: "😞", percent: "26%" },
  ];

  return (
    <div className="performance-section">
      {!hideTitle && (
        <h4>{title || `Edit ${doctorName}’s Performance`}</h4>
      )}

      {categories.map((category) => (
        <div key={category} className="rating-category">
          <label>{category}</label>
          <div className="rating-options">
            {options.map((option) => (
              <div key={option.label} className="rating-option">
                <div className="emoji">{option.emoji}</div>
                <div className="label">{option.label}</div>
                {showPercentage && (
                <div className="percentage-text">{option.percent}</div>
              )}

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceSection;

const PerformanceSection = ({
  title = "Rate Performance",
  doctorName = "Tomas",
  hideTitle = false,
  showPercentage = false,
  ratings = {},
  onRatingChange = () => {}
}) => {
  const categories = ["communication", "support", "guidance", "availability"];
  const labels = {
    communication: "Communication",
    support: "Support",
    guidance: "Guidance",
    availability: "Availability"
  };
  if (![communication, support, guidance, availability].every(val => ["Excellent", "Good", "Fair", "Poor"].includes(val))) {
  alert("Please rate all four performance categories before submitting.");
  return;
}

  const options = [
    { label: "Excellent", emoji: "😄" },
    { label: "Good", emoji: "🙂" },
    { label: "Fair", emoji: "😐" },
    { label: "Poor", emoji: "😞" },
  ];

  return (
    <div className="performance-section">
      {!hideTitle && (
        <h4>{title || `Edit ${doctorName}’s Performance`}</h4>
      )}

      {categories.map((category) => (
        <div key={category} className="rating-category">
          <label>{labels[category]}</label>
          <div className="rating-options">
            {options.map((option) => (
              <div
                key={option.label}
                className={`rating-option ${
                  ratings[category] === option.label ? "selected" : ""
                }`}
                onClick={() => onRatingChange(category, option.label)}
              >
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

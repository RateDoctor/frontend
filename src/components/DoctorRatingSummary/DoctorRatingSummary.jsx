import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorRatingSummary.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const DoctorRatingSummary = ({ doctorId }) => {
  const [data, setData] = useState(null);



  const getEmojiForLabel = (label) => {
  switch (label.toLowerCase()) {
    case "excellent":
      return "😄";
    case "good":
      return "🙂";
    case "Fair":
      return "😐";
    case "poor":
      return "😕";
    default:
      return "⭐";
  }
};

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/ratings/doctor/${doctorId}/summary`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, [doctorId]);

  if (!data) return <div className="spinner" />;

  const { percentages, feedback } = data;

  return (
    <div className="profile-superdrprofile">
      <div className="section-superdrprofile">
        <h3>Rating Distribution</h3>

        {Object.entries(percentages).map(([category, ratings]) => (
          <div key={category} style={{ marginBottom: "1rem" }}>
            <p className="admin-doctor-name">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <div className="drProfile-box" style={{ justifyContent: "space-between", maxWidth: "400px" }}>
              {Object.entries(ratings).map(([label, percent]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div className="percentage-text">{percent}%</div>
                  <div className="overallRating">{label}</div>
                  <div style={{ fontSize: "1.2rem", marginTop: "0.3rem" }}>{getEmojiForLabel(label)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-superdrprofile">
        <h3 className="section-feedback">Students Feedback</h3>
        <ul className="feedback-lists">
          {feedback.map((item, index) => (
            <li key={index} className="lists-of-feedback">
              <p className="feedback-paragraph">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorRatingSummary;

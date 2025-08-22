import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../layouts/load/load.jsx"; // ✅ Your Loader
import "./DoctorRatingSummary.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const DoctorRatingSummary = ({ doctorId }) => {
  const [feedback, setFeedback] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  const getEmojiForLabel = (label) => {
    switch (label?.toLowerCase()) {
      case "excellent": return "😄";
      case "good": return "🙂";
      case "fair": return "😐";
      case "poor": return "😕";
      default: return "⭐";
    }
  };

  const generateFakeId = () => Math.floor(Math.random() * 90000) + 10000;

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [ratingsRes, summaryRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/ratings/doctor/${doctorId}/summary`)
      ]);

      const doctorFeedback = (ratingsRes.data || [])
        .filter(f => f.doctorId?._id === doctorId)
        .map(f => ({
          id: generateFakeId(),
          text: f.additionalFeedback || "No comment",
          stars: f.stars || 0
        }));

      setFeedback(doctorFeedback);
      setPercentages(summaryRes.data?.percentages || {});
    } catch (err) {
      console.error("Failed to fetch doctor summary or feedback:", err);
      setFeedback([]);
      setPercentages({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId, token]);

  if (loading) return <Loader type={1} />; 
  if (!feedback.length) return <div className="section-superdrprofile">No feedback available</div>;

  return (
    <div className="profile-superdrprofile">

      {/* Rating Distribution (Old Design) */}
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

      {/* Feedback Section */}
      <div className="section-superdrprofile">
        <h3 className="section-feedback">Students Feedback</h3>
        <ul className="feedback-lists">
          {feedback.map(item => (
            <li key={item.id} className="lists-of-feedback">
              <p className="feedback-id">#{item.id}</p>
              <p className="feedback-paragraph">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default DoctorRatingSummary;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./DoctorRatingSummary.css";
// const BASE_URL = process.env.REACT_APP_API_URL;

// const DoctorRatingSummary = ({ doctorId }) => {
//   const [data, setData] = useState(null);



//   const getEmojiForLabel = (label) => {
//   switch (label.toLowerCase()) {
//     case "excellent":
//       return "😄";
//     case "good":
//       return "🙂";
//     case "Fair":
//       return "😐";
//     case "poor":
//       return "😕";
//     default:
//       return "⭐";
//   }
// };

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/ratings/doctor/${doctorId}/summary`);
//         setData(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSummary();
//   }, [doctorId]);

//   if (!data) return <div className="spinner" />;

//   const { percentages, feedback } = data;

//   return (
//     <div className="profile-superdrprofile">
//       <div className="section-superdrprofile">
//         <h3>Rating Distribution</h3>

//         {Object.entries(percentages).map(([category, ratings]) => (
//           <div key={category} style={{ marginBottom: "1rem" }}>
//             <p className="admin-doctor-name">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
//             <div className="drProfile-box" style={{ justifyContent: "space-between", maxWidth: "400px" }}>
//               {Object.entries(ratings).map(([label, percent]) => (
//                 <div key={label} style={{ textAlign: "center" }}>
//                   <div className="percentage-text">{percent}%</div>
//                   <div className="overallRating">{label}</div>
//                   <div style={{ fontSize: "1.2rem", marginTop: "0.3rem" }}>{getEmojiForLabel(label)}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="section-superdrprofile">
//         <h3 className="section-feedback">Students Feedback</h3>
//         <ul className="feedback-lists">
//           {feedback.map((item, index) => (
//             <li key={index} className="lists-of-feedback">
//               <p className="feedback-paragraph">{item.text}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default DoctorRatingSummary;

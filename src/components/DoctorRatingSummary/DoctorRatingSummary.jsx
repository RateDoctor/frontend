import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../layouts/load/load.jsx";
// import { ChevronDown, ChevronUp } from "lucide-react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiCheckCircle, FiInfo, FiAlertCircle } from "react-icons/fi";


import { motion, AnimatePresence } from "framer-motion";
import "./DoctorRatingSummary.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const DoctorRatingSummary = ({ doctorId }) => {
  const [feedback, setFeedback] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

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


  const getIconForAnswer = (value) => {
  switch (value?.toLowerCase()) {
    case "excellent":
      return <FiCheckCircle size={18} color="#4CAF50" />; // green check
    case "good":
      return <FiCheckCircle size={18} color="#8BC34A" />; // lighter green
    case "fair":
      return <FiInfo size={18} color="#FFC107" />; // amber info
    case "poor":
      return <FiAlertCircle size={18} color="#F44336" />; // red alert
    default:
      return <FiInfo size={18} color="#2196F3" />; // blue info default
  }
};

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
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
          stars: f.stars || 0,
          user: f.user?.name || "Anonymous",
          questionnaire: f.questionnaire || {} // ✅ always an object
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
  if (!feedback.length) {
  return (
    <div className="empty-feedback">
      <p>No feedback available for this doctor yet.</p>
    </div>
  );
}

  return (
    <div className="profile-superdrprofile">

      {/* Rating Distribution */}
      <div className="section-superdrprofile">
        <h3>Rating Distribution</h3>
        {Object.entries(percentages).map(([category, ratings]) => (
          <div key={category} style={{ marginBottom: "1rem" }}>
            <p className="admin-doctor-name">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <div className="drProfile-box" style={{ justifyContent: "space-between", maxWidth: "400px" }}>
              {Object.entries(ratings || {}).map(([label, percent]) => (
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
              <p className="feedback-id">#{item.id} - {item.user}</p>
              <p className="feedback-paragraph">{item.text}</p>

              {item.questionnaire && Object.keys(item.questionnaire).length > 0 && (
                <>
                  <button onClick={() => handleToggle(item.id)} className="toggle-btn">
                    {expanded === item.id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    <span>{expanded === item.id ? "Hide Answers" : "View Answers"}</span>
                  </button>

                  <AnimatePresence>
                    {expanded === item.id && (
                      <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="answers-block"
                      >
                        {Object.entries(item.questionnaire).map(([key, val]) => (
                          // <div key={key} className="answer">
                          //   <strong>{key}</strong> {getEmojiForLabel(key)} : {val}
                          // </div>
                          <div key={key} className="answer">
                            {getIconForAnswer(val)} 
                            <span className="answer-label"><strong>{key}:</strong></span>
                            <span className="answer-value">{val}</span>
                          </div>

                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
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
// import Loader from "../../layouts/load/load.jsx"; // ✅ Your Loader
// import "./DoctorRatingSummary.css";

// const BASE_URL = process.env.REACT_APP_API_URL;

// const DoctorRatingSummary = ({ doctorId }) => {
//   const [feedback, setFeedback] = useState([]);
//   const [percentages, setPercentages] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(null);

//   const token = localStorage.getItem("authToken");

//   const getEmojiForLabel = (label) => {
//     switch (label?.toLowerCase()) {
//       case "excellent": return "😄";
//       case "good": return "🙂";
//       case "fair": return "😐";
//       case "poor": return "😕";
//       default: return "⭐";
//     }
//   };

//   const generateFakeId = () => Math.floor(Math.random() * 90000) + 10000;

//   const fetchDoctorData = async () => {
//     setLoading(true);
//     try {
//       const [ratingsRes, summaryRes] = await Promise.all([
//         axios.get(`${BASE_URL}/api/ratings`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${BASE_URL}/api/ratings/doctor/${doctorId}/summary`)
//       ]);

//       const doctorFeedback = (ratingsRes.data || [])
//         .filter(f => f.doctorId?._id === doctorId)
//         .map(f => ({
//           id: generateFakeId(),
//           text: f.additionalFeedback || "No comment",
//           stars: f.stars || 0
//         }));

//       setFeedback(doctorFeedback);
//       setPercentages(summaryRes.data?.percentages || {});
//     } catch (err) {
//       console.error("Failed to fetch doctor summary or feedback:", err);
//       setFeedback([]);
//       setPercentages({});
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctorData();
//   }, [doctorId, token]);

//   if (loading) return <Loader type={1} />; 
//   if (!feedback.length) return <div className="section-superdrprofile">No feedback available</div>;

//   return (
//     <div className="profile-superdrprofile">

//       {/* Rating Distribution (Old Design) */}
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

//       {/* Feedback Section */}
//       <div className="section-superdrprofile">
//         <h3 className="section-feedback">Students Feedback</h3>
//         {/* <ul className="feedback-lists">
//           {feedback.map(item => (
//             <li key={item.id} className="lists-of-feedback">
//               <p className="feedback-id">#{item.id}</p>
//               <p className="feedback-paragraph">{item.text}</p>
//             </li>
//           ))}
//         </ul> */}

//         <ul className="feedback-lists">
//   {feedback.map(item => (
//     <li key={item.id} className="lists-of-feedback">
//       <p className="feedback-id">#{item.id} - {item.user}</p>
//       <p className="feedback-paragraph">{item.text}</p>

//       {/* Toggle answers */}
//       <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
//         {expanded === item.id ? "Hide Answers" : "View Answers"}
//       </button>

//       {expanded === item.id && (
//         <div className="answers-block">
//           {Object.entries(item.questionnaire).map(([key, val]) => (
//             <div key={key} className="answer">
//               <strong>{key}</strong>: {val}
//             </div>
//           ))}
//         </div>
//       )}
//     </li>
//   ))}
// </ul>

//       </div>

//     </div>
//   );
// };

// export default DoctorRatingSummary;



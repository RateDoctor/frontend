import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { sections } from "./data";
import "./myRatings.css";

const MyRatings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [editableQuestionnaire, setEditableQuestionnaire] = useState({});
  const [feedback, setFeedback] = useState("");
  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceRatings, setPerformanceRatings] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userId || !token) {
        setError("Missing userId or token.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/ratings/users/${userId}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatings(response.data);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Could not load ratings.");
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [userId, token]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", feedbackEditable);
    return () => document.body.classList.remove("no-scroll");
  }, [feedbackEditable]);

  const handleSelectRating = (rating) => {
    setSelectedRating(rating);
    setEditableQuestionnaire(rating.questionnaire || {});
    setFeedback(rating.additionalFeedback || "");
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings((prev) => prev.filter((r) => r._id !== ratingId));
      setSelectedRating(null);
    } catch (err) {
      console.error("Failed to delete rating:", err);
      alert("Failed to delete rating.");
    }
  };

const handleSaveFeedback = async () => {
  if (!selectedRating) return;

  setIsSaving(true); // Show loading

  try {
    await axios.put(
      `http://localhost:5000/api/ratings/${selectedRating._id}`,
      {
        additionalFeedback: feedback,
        questionnaire: editableQuestionnaire,
        performanceRatings: performanceRatings,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRatings((prev) =>
      prev.map((r) =>
        r._id === selectedRating._id
          ? {
              ...r,
              additionalFeedback: feedback,
              questionnaire: editableQuestionnaire,
              performanceRatings: performanceRatings,
            }
          : r
      )
    );

    setFeedbackEditable(false);
    setShowSuccessPopup(true);

    setTimeout(() => {
      setShowSuccessPopup(false);
      setSelectedRating(null); // Go back to list
      setIsSaving(false);      // Hide loading
    }, 1500);
  } catch (err) {
    console.error("Failed to save feedback:", err);
    alert("Failed to save feedback.");
    setIsSaving(false); // Stop loading
  }
};


 const renderDoctorList = () => (
  <div className="ratings-list">
    {ratings.length === 0 && <p>No ratings found.</p>}
    {ratings.map((rating) => {
      const doctor = rating.doctorId;
      return (
        <div
          key={rating._id}
          className="ratings-item"
          onClick={() => handleSelectRating(rating)}
        >
          {doctor?.profileImage?.fileUrl && (
            <img
              src={doctor.profileImage.fileUrl}
              alt={doctor.name}
              className="doctor-img"
            />
          )}
          <span className="doctor-name">{doctor?.name}</span>
          <FiTrash2
            className="delete-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRating(rating._id);
            }}
          />
          <hr />
        </div>
      );
    })}
  </div>
);

// setTimeout(() => {
//   setSelectedRating(null);
// }, 2000);


  const renderFeedbackSection = () => (
    <div className="feedback-section">
      <div className="feedback-header">
        <h4 className="my-rating-title-header">Additional Feedback</h4>
        <FiEdit2 className="penFeedback" onClick={() => setFeedbackEditable(true)} />
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="modal-textarea"
        rows={6}
        placeholder="Write your feedback here..."
      />
      {feedbackEditable && (
        <div className="modal-overlay">
          <button className="floating-done-button" onClick={handleSaveFeedback}>
            Save
          </button>
          <div className="modal-content">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="modal-textarea"
              rows={6}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderQuestionnaireSection = () => (
    <div className="questionnaire-section">
      <h4 className="title-questionnaire">Questionnaire</h4>
      <p className="paragraph-questionnaire">
        Share your thoughts and insights by completing the questionnaire.
      </p>
      {sections.map((section, index) => {
        const showTrash = ["Teaching Style", "Responsiveness", "Mentorship"].includes(section.title);
        return (
          <div key={index} className="question-block">
            <h5>{section.title}</h5>
            <p className="section-description">{section.description}</p>
            <div className="textarea-with-trash">
              <textarea
                placeholder={section.firstPlaceholder}
                value={editableQuestionnaire[section.title] || ""}
                onChange={(e) =>
                  setEditableQuestionnaire((prev) => ({
                    ...prev,
                    [section.title]: e.target.value,
                  }))
                }
              />
              {showTrash && (
                <FiTrash2
                  className="trash-icon"
                  onClick={() =>
                    setEditableQuestionnaire((prev) => ({
                      ...prev,
                      [section.title]: "",
                    }))
                  }
                />
              )}
            </div>
            {section.questions.map((q, i) => (
              <div key={i} className="question-field">
                <p>{q}</p>
                <textarea
                  className="question-fieldParagraph"
                  value={editableQuestionnaire[q] || ""}
                  onChange={(e) =>
                    setEditableQuestionnaire((prev) => ({
                      ...prev,
                      [q]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        );
      })}
      <button className="save-edits-btn" onClick={handleSaveFeedback} >
        Save Edits
      </button>
    </div>
  );

  const renderEditor = () => (
    <div className="edit-section-scrollable edit-section">
      <div className="doctor-info">
        <div className="doctor-infoBox">
          <img
            src={selectedRating?.doctorId?.profileImage?.fileUrl || "/default-avatar.png"}
            alt={selectedRating?.doctorId?.name}
            className="doctor-img"
          />
          <h3>{selectedRating?.doctorId?.name}</h3>
        </div>
        <button className="delete-btn" onClick={() => handleDeleteRating(selectedRating._id)}>
          Delete
        </button>
      </div>
      <PerformanceSection
        doctorName={selectedRating?.doctorId?.name}
        ratings={performanceRatings}
        onRatingChange={(category, value) =>
          setPerformanceRatings((prev) => ({
            ...prev,
            [category]: value,
          }))
        }
      />
      {renderFeedbackSection()}
      {renderQuestionnaireSection()}
    </div>
  );

  return (
    <div className="ratings-container">
      <div className="ratings-header">
        <FiArrowLeft
          className="back-icon"
          onClick={() => {
            if (selectedRating) {
              setSelectedRating(null);
              setFeedbackEditable(false);
            } else {
              navigate(-1);
            }
          }}
        />
        <h2>My Ratings</h2>
      </div>
      {loading && <p>Loading ratings...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (selectedRating ? renderEditor() : renderDoctorList())}

        {/* ✅ Loading + Success popup should be here */}
    {isSaving && (
      <div className="popup-overlay">
        <div className="popup-box">
          <div className="spinner" />
          <p>Saving your feedback...</p>
        </div>
      </div>
    )}

    {showSuccessPopup && (
      <div className="popup-overlay">
        <div className="popup-box success">
          <span className="checkmark">✅</span>
          <p>Saved successfully!</p>
        </div>
      </div>
    )}
    </div>
  );
};

export default MyRatings;



// import React, { useState, useEffect } from "react";
// import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import PerformanceSection from "../myRatings/PerformanceSection.jsx";
// import { sections } from "./data"; // Questionnaire config
// import "./myRatings.css";

// const MyRatings = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("authToken");
//   const userId = localStorage.getItem("userId");
//   const [editableQuestionnaire, setEditableQuestionnaire] = useState({});
//   const [ratings, setRatings] = useState([]);
//   const [selectedRating, setSelectedRating] = useState(null);
//   const [feedback, setFeedback] = useState("");
//   const [feedbackEditable, setFeedbackEditable] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchRatings = async () => {
//     const storedUserId = localStorage.getItem("userId");
//     const storedToken = localStorage.getItem("authToken");
//     console.log("Fetched from localStorage:", { storedUserId, storedToken });

//     if (!storedUserId || !storedToken) {
//       setError("Missing userId or token.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/ratings/users/${storedUserId}/ratings`,
//         {
//           headers: {
//             Authorization: `Bearer ${storedToken}`,
//           },
//         }
//       );
//       setRatings(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Could not load ratings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchRatings();
// }, []); 


//   useEffect(() => {
//     document.body.classList.toggle("no-scroll", feedbackEditable);
//     return () => document.body.classList.remove("no-scroll");
//   }, [feedbackEditable]);

//   const handleSelectRating = (rating) => {
//   setSelectedRating(rating);
//   setFeedback(rating.additionalFeedback || "");
//   setEditableQuestionnaire(rating.questionnaire || {});
// };

//   const handleDeleteRating = async (ratingId) => {
//     if (!window.confirm("Are you sure you want to delete this rating?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRatings((prev) => prev.filter((r) => r._id !== ratingId));
//       setSelectedRating(null);
//     } catch (err) {
//       alert("Failed to delete rating.");
//     }
//   };

// const handleSaveFeedback = async () => {
//   if (!selectedRating) return;
//   try {
//     await axios.put(
//       `http://localhost:5000/api/ratings/${selectedRating._id}`,
//       { 
//         additionalFeedback: feedback,
//         questionnaire: editableQuestionnaire
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setRatings((prev) =>
//       prev.map((r) =>
//         r._id === selectedRating._id ? { ...r, additionalFeedback: feedback, questionnaire: editableQuestionnaire } : r
//       )
//     );
//     setFeedbackEditable(false);
//   } catch (err) {
//     alert("Failed to save feedback.");
//   }
// };


//   const renderDoctorList = () => (
//     <div className="ratings-list">
//       {ratings.length === 0 && <p>No ratings found.</p>}
//       {ratings.map((rating) => {
//         const doctor = rating.doctorId;
//         return (
//           <div
//             key={rating._id}
//             className="ratings-item"
//             onClick={() => handleSelectRating(rating)}
//           >
//             {doctor.profileImage?.fileUrl ? (
//             <img
//               src={doctor.profileImage?.fileUrl || "/default-avatar.png"}
//               alt={doctor.name}
//               className="doctor-img"
//             />
//             ) : null}
//             <span className="doctor-name">{doctor.name}</span>
//             <FiTrash2
//               className="delete-icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDeleteRating(rating._id);
//               }}
//             />
//             <hr />
//           </div>
//         );
//       })}
//     </div>
//   );

//   const renderFeedbackSection = () => (
//     <>
//       <div className="feedback-section">
//         <div className="feedback-header">
//           <h4 className="my-rating-title-header">Additional Feedback</h4>
//           <FiEdit2 className="penFeedback" onClick={() => setFeedbackEditable(true)} />
//         </div>
    

//          <textarea
//               value={feedback || "No feedback provided."}
//               onChange={(e) => setFeedback(e.target.value)}
//               className="modal-textarea"
//               rows={6}
//             />
//       </div>

//       {feedbackEditable && (
//         <div className="modal-overlay">
//           <button className="floating-done-button" onClick={handleSaveFeedback}>
//             Save
//           </button>
//           <div className="modal-content">
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               className="modal-textarea"
//               rows={6}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );

//   const renderQuestionnaireSection = () => (
//     <div className="questionnaire-section">
//       <h4 className="title-questionnaire">Questionnaire</h4>
//       <p className="paragraph-questionnaire">
//         Share your thoughts and insights by completing the questionnaire.
//       </p>
//     {sections.map((section, index) => {
//   // Determine if this section should have the trash icon on first textarea
//   const showTrashForFirstTextarea = 
//     section.title === "Teaching Style" ||
//     section.title === "Responsiveness" ||
//     section.title === "Mentorship";

//       return (
//         <div key={index} className="question-block">
//           <h5>{section.title}</h5>
//           <p className="section-description">{section.description}</p>
//           <div className="textarea-with-trash">
//             <textarea
//             placeholder={section.firstPlaceholder}
//             value={editableQuestionnaire[section.title] || ""}
//             onChange={(e) =>
//               setEditableQuestionnaire(prev => ({
//                 ...prev,
//                 [section.title]: e.target.value
//               }))
//             }
//           />
//             {showTrashForFirstTextarea && (
//               <FiTrash2
//                 className="trash-icon"
//                 onClick={() => {
//                   // Clear the text area's value in selectedRating's questionnaire
//                   const updatedRating = { ...selectedRating };
//                   if (updatedRating.questionnaire) {
//                     updatedRating.questionnaire[section.title] = "";
//                     setSelectedRating(updatedRating);
//                   }
//                 }}
//               />
//             )}
//           </div>

//           {section.questions.map((q, i) => (
//             <div key={i} className="question-field">
//               <p>{q}</p>
//               <textarea
//               className="question-fieldParagraph"
//               value={editableQuestionnaire[q] || ""}
//               onChange={(e) =>
//                 setEditableQuestionnaire(prev => ({
//                   ...prev,
//                   [q]: e.target.value
//                 }))
//               }
//             />
//             </div>
//           ))}
//         </div>
//       );
//     })}


//        <button className="save-edits-btn" onClick={handleSaveFeedback} disabled={!feedbackEditable}>
//         Save Edits
//       </button>
//     </div>

    
//   );

//   const renderEditor = () => (
//     <div className="edit-section-scrollable edit-section">
//       <div className="doctor-info">
//         <div className="doctor-infoBox">
//           <img
//             src={selectedRating.doctorId.profileImage?.fileUrl || "/default-avatar.png"}
//             alt={selectedRating.doctorId.name}
//             className="doctor-img"
//           />
//           <h3>{selectedRating.doctorId.name}</h3>
//         </div>
//         <button className="delete-btn" onClick={() => handleDeleteRating(selectedRating._id)}>
//           Delete
//         </button>
//       </div>

//       <PerformanceSection doctorName={selectedRating.doctorId.name} />

//       {renderFeedbackSection()}

//       {renderQuestionnaireSection()}

    

//       {/* <button
//         className="back-btn"
//         onClick={() => {
//           setSelectedRating(null);
//           setFeedbackEditable(false);
//         }}
//       >
//         Back to List
//       </button> */}
//     </div>
//   );

//   return (
//     <div className="ratings-container">
//       <div className="ratings-header">
//         <FiArrowLeft
//           className="back-icon"
//           onClick={() => {
//             if (selectedRating) {
//               setSelectedRating(null);
//               setFeedbackEditable(false);
//             } else {
//               navigate(-1);
//             }
//           }}
//         />
//         <h2>My Ratings</h2>
//       </div>

//       {loading && <p>Loading ratings...</p>}
//       {error && <p className="error">{error}</p>}

//       {!loading && !error && (
//         <>{selectedRating ? renderEditor() : renderDoctorList()}</>
//       )}
//     </div>
//   );
// };

// export default MyRatings;



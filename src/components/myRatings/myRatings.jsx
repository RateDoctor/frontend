import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";

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
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const isNewRating = searchParams.get("new") === "true";


console.log("doctorId:", doctorId);
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

      const ratingsData = response.data;
      setRatings(ratingsData);
      console.log("Fetched ratings data:", ratingsData);

      if (!doctorId) {
        setSelectedRating(null);
        return;
      }

      const existingRating = ratingsData.find((r) => {
        const docId = r.doctorId?._id || r.doctorId;
        console.log("Comparing rating doctorId:", docId, "with URL doctorId:", doctorId);
        return String(docId) === String(doctorId);
      });

      console.log("existingRating after find:", existingRating);

     if (existingRating) {
      setSelectedRating(existingRating);
      setEditableQuestionnaire(existingRating.questionnaire || {});
      setFeedback(existingRating.additionalFeedback || "");
    }  else {
        const doctorRes = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctor = doctorRes.data.doctor;
        console.log("Fetched doctor for new rating:", doctor);
        const newRating = {
          _id: "new",
          doctorId: doctor,
          additionalFeedback: "",
          questionnaire: {},
          performanceRatings: {},
        };

        setSelectedRating(newRating);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
      setError("Could not load ratings.");
    } finally {
      setLoading(false);
    }
  };

  fetchRatings();
}, [userId, token, doctorId, isNewRating]);



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
    if (selectedRating._id === "new") {
      // إنشاء تقييم جديد
      const response = await axios.post(
        `http://localhost:5000/api/ratings`,
        {
          doctorId: selectedRating.doctorId._id, // لازم ترسل معرف الدكتور
          additionalFeedback: feedback,
          questionnaire: editableQuestionnaire,
          performanceRatings: performanceRatings,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // أضف التقييم الجديد للقائمة
      setRatings((prev) => [...prev, response.data]);

    } else {
      // تعديل تقييم موجود
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
    }

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




// const renderDoctorList = () => (
//   <div className="ratings-list">
//     {ratings.length === 0 && <p>No ratings found.</p>}
//     {ratings.map((rating) => {
//       const doctor = rating.doctorId;
//       if (!doctor) return null;  
//       return (
//         <div
//           key={rating._id}
//           className="ratings-item"
//           onClick={() => handleSelectRating(rating)}
//         >
//           {doctor.profileImage?.fileUrl ? (
//             <img
//               src={doctor.profileImage.fileUrl}
//               alt={doctor.name}
//               className="doctor-img"
//             />
//           ) : (
//             <img
//               src="/default-avatar.png"
//               alt="Default avatar"
//               className="doctor-img"
//             />
//           )}
//          <span className="doctor-name">{doctor?.name || "Unnamed Doctor"}</span>


//           <FiTrash2
//             className="delete-icon"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDeleteRating(rating._id);
//             }}
//           />
//           <hr />
//         </div>
//       );
//     })}
//   </div>
// );


const renderDoctorList = () => (
  <div className="ratings-list">
    {ratings.length === 0 && <p>No ratings found.</p>}
    {ratings.map((rating) => {
      const doctor = rating.doctorId;
      console.log("Doctor in list:", doctor); // 🔍 Log here

      if (!doctor) return null;

      return (
        <div
          key={rating._id}
          className="ratings-item"
          onClick={() => handleSelectRating(rating)}
        >
          <img
            src={doctor.profileImage?.fileUrl || "/default-avatar.png"}
            alt={doctor.name || "Doctor Avatar"}
            className="doctor-img"
          />


          <span className="doctor-name">
          {doctor.name || "Unnamed Doctor"}
          </span>



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
          <h3>{selectedRating?.doctorId?.name || "Unnamed Doctor"}</h3>
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

    {/* ✅ This is the main conditional rendering block */}
    {!loading && !error && (
      selectedRating ? renderEditor() : renderDoctorList()
    )}

    {/* ✅ Saving and Success Popups */}
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




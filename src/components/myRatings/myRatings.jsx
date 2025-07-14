import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";
import axios from "axios";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { sections } from "./data";
import "./myRatings.css";
const BASE_URL = process.env.REACT_APP_API_URL;


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


const getAvatarForDoctor = (doctor) => {
  if (!doctor) return defaultAvatar;

  if (doctor.profileImage && doctor.profileImage.fileUrl) {
    return doctor.profileImage.fileUrl;
  }

  if (doctor.gender === "female" || doctor.gender === "woman") {
    return female;
  } else if (doctor.gender === "male" || doctor.gender === "man") {
    return man;
  }

  return defaultAvatar;
};

useEffect(() => {
  const fetchRatings = async () => {
    if (!userId || !token) {
      setError("Missing userId or token.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/ratings/users/${userId}/ratings`, {
        headers: {   
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache"
        },
      });

      const ratingsData = response.data;

      // Hydrate and normalize doctor data in one step
      const hydratedAndNormalizedRatings = await Promise.all(
        ratingsData.map(async (rating) => {
          let doctor = rating.doctorId;

          if (typeof doctor === "string" || !doctor?.name) {
            try {
              const res = await axios.get(
                `${BASE_URL}/doctors/${doctor}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              doctor = res.data.doctor;
            } catch (err) {
              console.warn("Failed to fetch doctor:", doctor, err);
              doctor = { name: "Unknown Doctor", _id: doctor };
            }
          }

          // Ensure valid doctor name fallback
          if (!doctor.name || typeof doctor.name !== "string" || doctor.name.trim() === "") {
            doctor.name = "Unnamed Doctor";
          }

          return { ...rating, doctorId: doctor };
        })
      );

      setRatings(hydratedAndNormalizedRatings);

      if (!doctorId) {
        setSelectedRating(null);
        setLoading(false);
        return;
      }

      // Find existing rating with matching doctorId
      const existingRating = hydratedAndNormalizedRatings.find((r) => {
        const docId = r.doctorId?._id || r.doctorId;
        return String(docId) === String(doctorId);
      });

      if (existingRating) {
        setSelectedRating(existingRating);
        setEditableQuestionnaire(existingRating.questionnaire || {});
        setFeedback(existingRating.additionalFeedback || "");
        setPerformanceRatings({
          communication: existingRating.communication,
          support: existingRating.support,
          guidance: existingRating.guidance,
          availability: existingRating.availability,
        });
      } else {
        // If no existing rating but doctorId is present, create a new one for editing
        const doctorRes = await axios.get(`${BASE_URL}/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctor = doctorRes.data.doctor;
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
    setPerformanceRatings({
      communication: rating.communication,
      support: rating.support,
      guidance: rating.guidance,
      availability: rating.availability,
    });
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    try {
      await axios.delete(`${BASE_URL}/ratings/${ratingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings((prev) => prev.filter((r) => r._id !== ratingId));
      setSelectedRating(null);
    } catch (err) {
      console.error("Failed to delete rating:", err);
      alert("Failed to delete rating.");
    }
  };



  function buildQuestionnaire(flatObj) {
  return {
    teachingStyle: {
      description: flatObj[sections[0].title] || "",
      complexConcepts: flatObj[sections[0].questions[0]] || "",
      criticalThinking: flatObj[sections[0].questions[1]] || ""
    },
    responsiveness: {
      responsiveness: flatObj[sections[1].title] || "",
      feedbackTurnaround: flatObj[sections[1].questions[0]] || "",
      constructiveFeedback: flatObj[sections[1].questions[1]] || ""
    },
    mentorship: {
      researchGuidance: flatObj[sections[2].questions[0]] || "",
      methodologySupport: flatObj[sections[2].questions[1]] || "",
      professionalDevelopment: flatObj[sections[2].questions[2]] || ""
    },
    overallSupport: {
      overallSupport: flatObj[sections[3].questions[0]] || "",
      academicChallenges: flatObj[sections[3].questions[1]] || "",
      contributionToSuccess: flatObj[sections[3].questions[2]] || ""
    }
  };
}



const handleSaveFeedback = async () => {
  if (!selectedRating) return;

  setIsSaving(true);

  
  const questionnairePayload = buildQuestionnaire(editableQuestionnaire, sections);

   try {
    if (selectedRating._id === "new") {
      const response = await axios.post(
        `${BASE_URL}/ratings`,
        {
          doctorId: selectedRating.doctorId._id,
          communication: performanceRatings.communication,
          support:       performanceRatings.support,
          guidance:      performanceRatings.guidance,
          availability:  performanceRatings.availability,
          additionalFeedback: feedback,
          questionnaire: editableQuestionnaire,
          // questionnaire: questionnairePayload,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      let newRating = response.data;
      setRatings((prev) => [...prev, newRating]);
      setSelectedRating(newRating);

    }  else {
      await axios.put(
        `${BASE_URL}/ratings/${selectedRating._id}`,
        {
          additionalFeedback: feedback,
          questionnaire: editableQuestionnaire,
          // questionnaire: questionnairePayload,
          performanceRatings,
        },
        { headers: { Authorization: `Bearer ${token}` } }

        
      );


    
      const updatedRating = {
        ...selectedRating,
        additionalFeedback: feedback,
        questionnaire: questionnairePayload,
        performanceRatings,
      };
      setSelectedRating(updatedRating);
      setRatings((prev) =>
        prev.map((r) => (r._id === selectedRating._id ? updatedRating : r))
      );
    }

    setFeedbackEditable(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate(-1);  
    }, 1500);


  } catch (err) {
    console.error("Failed to save feedback:", err);
    alert("Failed to save feedback.");
    setIsSaving(false);
  }
};

const renderDoctorList = () => {


  console.log("Ratings in renderDoctorList:", ratings);
console.log("Ratings with missing doctor or name:", ratings.filter(r => !r.doctorId || !r.doctorId.name));

if (loading) {
  return (
    <div className="ratings-loading-center">
      <div className="spinner" />
      <p>Loading doctors...</p>
    </div>
  );
}

  return (
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
            <img
              src={getAvatarForDoctor(doctor)}
              alt={doctor.name || "Doctor Avatar"}
              className="doctor-img"
            />
            <span className="doctor-name">
              {doctor.name}
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
};



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
    <div className="edit-section-scrollable edit-section" >
      <div className="doctor-info">
        <div className="doctor-infoBox">
          <img
            // src={selectedRating?.doctorId?.profileImage?.fileUrl || "/default-avatar.png"}
            src={getAvatarForDoctor(selectedRating?.doctorId)}
            alt={selectedRating?.doctorId?.name || "Doctor Avatar"}
            className="doctor-img"
          />
          <h3>{selectedRating?.doctorId?.name || "Unnamed Doctor"}</h3>
        </div>
        <button className="delete-btn" 
            onClick={(e) => {
            e.stopPropagation();
            handleDeleteRating(selectedRating._id); 
            }}
          >
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




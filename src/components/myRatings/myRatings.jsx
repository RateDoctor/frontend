import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { ratedDoctors, sections } from './data';
import "./myRatings.css";

const MyRatings = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [feedback, setFeedback] = useState(
    "Choosing Dr. Tomas Tillman as my mentor was one of the best decisions I made during my PhD. Their commitment to excellence, ability to provide constructive criticism, and genuine interest in my success made for a fulfilling research experience. 😄"
  );



  useEffect(() => {
  if (feedbackEditable) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  // Cleanup when unmounting
  return () => document.body.classList.remove("no-scroll");
}, [feedbackEditable]);

// const renderPerformanceSection = () => {
//     return (
//       <div className="performance-section">
//         <h4>Edit Tomas’s Performance</h4>
//         {["Communication", "Support", "Guidance", "Availability"].map(
//           (category) => (
//             <div key={category} className="rating-category">
//               <label>{category}</label>
//               <div className="rating-options">
//                 {[
//                 { label: "Excellent", emoji: "😄" },
//                 { label: "Good", emoji: "🙂" },
//                 { label: "Fair", emoji: "😐" },
//                 { label: "Poor", emoji: "😞" },
//                   ].map((option) => (
//                     <div key={option.label} className="rating-option">
//                     <div className="emoji">{option.emoji}</div>
//                     <div className="label">{option.label}</div>
//                    </div>
//                 ))}
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     );
// };

 <PerformanceSection/> 





const renderFeedbackSection = () => (
  <>
    <div className="feedback-section">
      <div className="feedback-header">
        <h4>Additional Feedback</h4>
        <FiEdit2
          className="penFeedback"
          onClick={() => setFeedbackEditable(true)}
        />
      </div>
      <p>{feedback}</p>
    </div>

    {feedbackEditable && (
      <div className="modal-overlay">
        {/* Floating Done button outside modal box */}
        <button
          className="floating-done-button"
          onClick={() => setFeedbackEditable(false)}
        >
          Done
        </button>

        <div className="modal-content">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="modal-textarea"
          />
        </div>
      </div>
    )}
  </>
);


const renderQuestionnaireSection = () => {
  
  return (
    <div className="questionnaire-section">
      <h4 className="title-questionnaire">Questionnaire</h4>
      <p className="paragraph-questionnaire">
        Share your thoughts and insights by completing the questionnaire,
        helping us enhance the overall academic experience.
      </p>
      {sections.map((section, index) => (

        <div key={index} className="question-block">
          <h5>{section.title}</h5>
          <p className="section-description">{section.description}</p>
          <div className="textarea-with-icon">
            <textarea
              placeholder={section.firstPlaceholder}
            />
          {index !== sections.length - 1 && <FiTrash2 className="delete-icon" />}
          </div>
          {section.questions.map((q, i) => (
            <div key={i} className="question-field">
              <p >{q}</p>
              <textarea className="question-fieldParagraph"  />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


return (
    <div className="ratings-container">
      <div className="ratings-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>My Ratings</h2>
      </div>

      {!selectedDoctor ? (
        <div className="ratings-list">
          {ratedDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="ratings-item"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <img src={doctor.image} alt={doctor.name} className="doctor-img" />
              <span className="doctor-name">{doctor.name}</span>
              <FiTrash2 className="delete-icon" />
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <div className="edit-section-scrollable edit-section">
          <div className="doctor-info">
            <div className="doctor-infoBox">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="doctor-img" />
                <h3>{selectedDoctor.name}</h3>
            </div>
           
            <button className="delete-btn"> Delete </button>
          </div>
          <PerformanceSection doctorName={selectedDoctor?.name} />
          {renderFeedbackSection()}
          {renderQuestionnaireSection()}
          <button className="save-edits-btn">Save Edits</button>
        </div>
      )}
    </div>
  );
};

export default MyRatings;

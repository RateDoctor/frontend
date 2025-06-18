import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { ratedDoctors, sections } from '../myRatings/data.js';
import "./ratesupervisor.css";

const RateSupervisor = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [feedback, setFeedback] = useState("");



  useEffect(() => {
  if (feedbackEditable) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  // Cleanup when unmounting
  return () => document.body.classList.remove("no-scroll");
}, [feedbackEditable]);


 <PerformanceSection/> 





const renderFeedbackSection = () => (
  <>
    <div className="feedback-section">
      <div className="rate-feedback-header">
        <h4 className="rate-header-title">Additional Feedback</h4>
      </div>
      <p className="rate-paragraph-box">{feedback}</p>
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

        {/* <div className="modal-content">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="modal-rate-textarea"
          />
        </div> */}
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
          <h5 className="rate-section--title">{section.title}</h5>
          <p className="section-rate-description">{section.description}</p>
          <div className="textarea-rate-with-icon">
            <textarea name="rate-question-fieldParagraph" id="rate-question-fieldParagraph"></textarea>
          </div>
          {section.questions.map((q, i) => (
            <div key={i} className="question-field">
              <p className="rate-question">{q}</p>
             <textarea name="question-fieldParagraph" id="rate-question-fieldParagraph"></textarea>    
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
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <div className="edit-section-scrollable edit-section">
          <div className="doctor-rate-info">
            <div className="doctor-rate-infoBox">
                 <h3 className="rate-title">Rate Erick Bernhard</h3>
                 <p className="rate-paragraph">Share your valuable feedback about your experience with Erick.</p>
            </div>
           
          </div>
          <PerformanceSection doctorName={selectedDoctor?.name} />
          {renderFeedbackSection()}
          {renderQuestionnaireSection()}
          <button className="save-rate-edits-btn">Submit</button>
        </div>
      )}
    </div>
  );
};

export default RateSupervisor;

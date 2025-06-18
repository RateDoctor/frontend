import React, { useState } from "react";
import { FiArrowLeft, FiTrash2, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import "./editRating.css";

const EditRating = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [feedback, setFeedback] = useState(
    "Choosing Dr. Tomas Tillman as my mentor was one of the best decisions I made during my PhD. Their commitment to excellence, ability to provide constructive criticism, and genuine interest in my success made for a fulfilling research experience. 😄"
  );

  return (
    <div className="edit-rating-container">
      <div className="edit-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>My Ratings</h2>
      </div>

      <div className="doctor-info">
        <h3>Tomas Tillman</h3>
        <div className="actions">
          <button className="delete-btn">
            <FiTrash2 /> Delete
          </button>
          <button className="edit-btn">Edit</button>
        </div>
      </div>

      <div className="section">
        <h4>Performance</h4>
        {["Communication", "Support", "Guidance", "Availability"].map((cat) => (
          <div key={cat} className="rating-question">
            <label>{cat}</label>
            <select>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>
        ))}
      </div>

      <div className="section feedback-section">
        <div className="feedback-header">
          <h4>Additional Feedback</h4>
          <FiEdit
            className="edit-icon"
            onClick={() => setFeedbackEditable(true)}
          />
        </div>
        {feedbackEditable ? (
          <textarea
          className="edit-rating"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        ) : (
          <p>{feedback}</p>
        )}
      </div>

      <div className="section">
        <h4>Questionnaire</h4>
        <p>
          Share your thoughts and insights by completing the questionnaire,
          helping us enhance the overall academic experience.
        </p>

        {[
          {
            title: "Teaching Style",
            questions: [
              "How would you describe your supervisor's teaching style during your PhD program?",
              "Did your supervisor effectively communicate complex concepts and methodologies?",
              "To what extent did your supervisor encourage critical thinking and independent research?",
            ],
          },
          {
            title: "Responsiveness",
            questions: [
              "How responsive was your supervisor to your emails, messages, or requests for meetings?",
              "Were you satisfied with the turnaround time for feedback on your work or queries?",
              "Did your supervisor provide constructive feedback in a timely manner?",
            ],
          },
          {
            title: "Mentorship",
            questions: [
              "To what extent did your supervisor provide guidance and support in defining your research objectives?",
              "How well did your supervisor mentor you in terms of research methodology and data analysis?",
              "Did your supervisor actively support your academic and professional development?",
            ],
          },
          {
            title: "Overall Support",
            questions: [
              "How would you rate the overall support you received from your supervisor throughout your PhD program?",
              "Did your supervisor provide assistance in navigating academic challenges or administrative issues?",
              "In what ways did your supervisor contribute to your overall success as a PhD student?",
            ],
          },
        ].map((section, idx) => (
          <div key={idx} className="question-block">
            <h5>{section.title}</h5>
            {section.questions.map((q, i) => (
              <div key={i}>
                <label>{q}</label>
                <textarea />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="save-edits-btn">Save Edits</button>
    </div>
  );
};

export default EditRating;

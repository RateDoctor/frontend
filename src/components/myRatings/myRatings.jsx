import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { sections } from "./data"; // Your questionnaire data here
import "./myRatings.css";

const MyRatings = () => {
  const navigate = useNavigate();

  // Auth token and userId assumed to be in localStorage or from your auth context
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // State variables
  const [ratings, setRatings] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ratings on mount and when userId or token changes
useEffect(() => {
  const fetchRatings = async () => {
    if (!userId) {
      setError("User ID missing");
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`http://localhost:5000/api/ratings/users/${userId}/ratings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRatings(res.data);
    } catch (err) {
      console.error(err);
      setError("Could not load ratings.");
    } finally {
      setLoading(false);
    }
  };

  fetchRatings();
}, [userId, token]);



  // Prevent background scroll when feedback modal is open
  useEffect(() => {
    if (feedbackEditable) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [feedbackEditable]);

  // When selecting a doctor, set state and feedback
  const handleSelectDoctor = (rating) => {
    const doctor = rating.doctorId;
    setSelectedDoctor({
      id: doctor._id,
      name: doctor.name,
      image: doctor.profileImage?.fileUrl || "/default-avatar.png",
      rating,
    });
    setFeedback(rating.additionalFeedback || "");
  };

  // Delete rating handler (optional)
  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings((prev) => prev.filter((r) => r._id !== ratingId));
      setSelectedDoctor(null);
    } catch (err) {
      alert("Failed to delete rating.");
    }
  };

  // Save feedback handler (simplified)
  const handleSaveFeedback = async () => {
    if (!selectedDoctor) return;

    try {
      await axios.put(
        `http://localhost:5000/api/ratings/${selectedDoctor.rating._id}`,
        { additionalFeedback: feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update locally to reflect saved feedback
      setRatings((prev) =>
        prev.map((r) =>
          r._id === selectedDoctor.rating._id
            ? { ...r, additionalFeedback: feedback }
            : r
        )
      );
      setFeedbackEditable(false);
    } catch (err) {
      alert("Failed to save feedback.");
    }
  };

  // Rendering doctor list view
  const renderDoctorList = () => (
    <div className="ratings-list">
      {ratings.length === 0 && <p>No ratings found.</p>}
      {ratings.map((rating) => {
        const doctor = rating.doctorId;
        return (
          <div
            key={rating._id}
            className="ratings-item"
            onClick={() => handleSelectDoctor(rating)}
          >
            <img
              src={doctor.profileImage?.fileUrl || "/default-avatar.png"}
              alt={doctor.name}
              className="doctor-img"
            />
            <span className="doctor-name">{doctor.name}</span>
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

  // Render feedback edit modal
  const renderFeedbackSection = () => (
    <>
      <div className="feedback-section">
        <div className="feedback-header">
          <h4 className="my-rating-title-header">Additional Feedback</h4>
          <FiEdit2
            className="penFeedback"
            onClick={() => setFeedbackEditable(true)}
          />
        </div>
        <p>{feedback || "No feedback provided."}</p>
      </div>

      {feedbackEditable && (
        <div className="modal-overlay">
          <button
            className="floating-done-button"
            onClick={handleSaveFeedback}
          >
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
    </>
  );

  // Render questionnaire section (read-only)
  const renderQuestionnaireSection = () => (
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
              disabled
              value={selectedDoctor?.rating?.questionnaire?.[section.title] || ""}
            />
            {index !== sections.length - 1 && (
              <FiTrash2 className="delete-icon" />
            )}
          </div>
          {section.questions.map((q, i) => (
            <div key={i} className="question-field">
              <p>{q}</p>
              <textarea
                className="question-fieldParagraph"
                disabled
                value={
                  selectedDoctor?.rating?.questionnaire?.[q] || ""
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Render edit view for selected doctor rating
  const renderEditor = () => (
    <div className="edit-section-scrollable edit-section">
      <div className="doctor-info">
        <div className="doctor-infoBox">
          <img
            src={selectedDoctor.image}
            alt={selectedDoctor.name}
            className="doctor-img"
          />
          <h3>{selectedDoctor.name}</h3>
        </div>
        <button
          className="delete-btn"
          onClick={() => handleDeleteRating(selectedDoctor.rating._id)}
        >
          Delete
        </button>
      </div>

      <PerformanceSection doctorName={selectedDoctor.name} />

      {renderFeedbackSection()}

      {renderQuestionnaireSection()}

      <button
        className="save-edits-btn"
        onClick={handleSaveFeedback}
        disabled={!feedbackEditable}
      >
        Save Edits
      </button>

      <button
        className="back-btn"
        onClick={() => {
          setSelectedDoctor(null);
          setFeedbackEditable(false);
        }}
      >
        Back to List
      </button>
    </div>
  );

  return (
    <div className="ratings-container">
      <div className="ratings-header">
        <FiArrowLeft
          className="back-icon"
          onClick={() => {
            if (selectedDoctor) {
              setSelectedDoctor(null);
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

      {!loading && !error && (
        <>
          {selectedDoctor ? renderEditor() : renderDoctorList()}
        </>
      )}
    </div>
  );
};

export default MyRatings;




// import React, { useState, useEffect } from "react";
// import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import PerformanceSection from "../myRatings/PerformanceSection.jsx";
// import { ratedDoctors, sections } from './data';
// import "./myRatings.css";

// const MyRatings = () => {
//   const navigate = useNavigate();
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [feedbackEditable, setFeedbackEditable] = useState(false);
//   const [feedback, setFeedback] = useState(
//     "Choosing Dr. Tomas Tillman as my mentor was one of the best decisions I made during my PhD. Their commitment to excellence, ability to provide constructive criticism, and genuine interest in my success made for a fulfilling research experience. 😄"
//   );



//   useEffect(() => {
//   if (feedbackEditable) {
//     document.body.classList.add("no-scroll");
//   } else {
//     document.body.classList.remove("no-scroll");
//   }

//   // Cleanup when unmounting
//   return () => document.body.classList.remove("no-scroll");
// }, [feedbackEditable]);


//  <PerformanceSection/> 


// const renderFeedbackSection = () => (
//   <>
//     <div className="feedback-section">
//       <div className="feedback-header">
//         <h4 className="my-rating-title-header">Additional Feedback</h4>
//         <FiEdit2
//           className="penFeedback"
//           onClick={() => setFeedbackEditable(true)}
//         />
//       </div>
//       <p>{feedback}</p>
//     </div>

//     {feedbackEditable && (
//       <div className="modal-overlay">
//         {/* Floating Done button outside modal box */}
//         <button
//           className="floating-done-button"
//           onClick={() => setFeedbackEditable(false)}
//         >
//           Done
//         </button>

//         <div className="modal-content">
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             className="modal-textarea"
//           />
//         </div>
//       </div>
//     )}
//   </>
// );


// const renderQuestionnaireSection = () => {
  
//   return (
//     <div className="questionnaire-section">
//       <h4 className="title-questionnaire">Questionnaire</h4>
//       <p className="paragraph-questionnaire">
//         Share your thoughts and insights by completing the questionnaire,
//         helping us enhance the overall academic experience.
//       </p>
//       {sections.map((section, index) => (

//         <div key={index} className="question-block">
//           <h5>{section.title}</h5>
//           <p className="section-description">{section.description}</p>
//           <div className="textarea-with-icon">
//             <textarea
//               placeholder={section.firstPlaceholder}
//             />
//           {index !== sections.length - 1 && <FiTrash2 className="delete-icon" />}
//           </div>
//           {section.questions.map((q, i) => (
//             <div key={i} className="question-field">
//               <p >{q}</p>
//               <textarea className="question-fieldParagraph"  />
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };


// return (
//     <div className="ratings-container">
//       <div className="ratings-header">
//         <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
//         <h2>My Ratings</h2>
//       </div>

//       {!selectedDoctor ? (
//         <div className="ratings-list">
//           {ratedDoctors.map((doctor) => (
//             <div
//               key={doctor.id}
//               className="ratings-item"
//               onClick={() => setSelectedDoctor(doctor)}
//             >
//               <img src={doctor.image} alt={doctor.name} className="doctor-img" />
//               <span className="doctor-name">{doctor.name}</span>
//               <FiTrash2 className="delete-icon" />
//               <hr />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="edit-section-scrollable edit-section">
//           <div className="doctor-info">
//             <div className="doctor-infoBox">
//                 <img src={selectedDoctor.image} alt={selectedDoctor.name} className="doctor-img" />
//                 <h3>{selectedDoctor.name}</h3>
//             </div>
           
//             <button className="delete-btn"> Delete </button>
//           </div>
//           <PerformanceSection doctorName={selectedDoctor?.name} />
//           {renderFeedbackSection()}
//           {renderQuestionnaireSection()}
//           <button className="save-edits-btn">Save Edits</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyRatings;

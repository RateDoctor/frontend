import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import PerformanceSection from "../myRatings/PerformanceSection.jsx";
import { sections } from '../myRatings/data.js';
import "./ratesupervisor.css";
const BASE_URL = process.env.REACT_APP_API_URL;


const RateSupervisor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackEditable, setFeedbackEditable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questionnaire, setQuestionnaire] = useState({});
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");


  const [ratings, setRatings] = useState({
  communication: "",
  support: "",
  guidance: "",
  availability: ""
});

const handleRatingChange = (category, value) => {
  setRatings((prev) => ({
    ...prev,
    [category]: value
  }));
};


console.log("👨‍⚕️ Received doctorId from query param:", doctorId);



  // ✅ Handle scroll lock
  useEffect(() => {

    if (feedbackEditable) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [feedbackEditable]);



useEffect(() => {
  console.log("➡️ Full location state:", location.state);
  console.log("👨‍⚕️ Received doctorId:", doctorId);
}, [doctorId, location.state]);

  // ✅ Fetch doctor when mounted


  const handleTextareaChange = (key, value) => {
    setQuestionnaire((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  

  useEffect(() => {
  if (!doctorId) return;

  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${BASE_URL}/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctorData(res.data.doctor);
    } catch (err) {
      console.error("Error fetching doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctor();
}, [doctorId]);

if (loading) return <p>Loading...</p>;
if (!doctorData) return <p>Doctor not found.</p>;
console.log("Loading:", loading);
console.log("DoctorData:", doctorData);



const handleSubmit = async () => {
   if (
    !ratings.communication ||
    !ratings.support ||
    !ratings.guidance ||
    !ratings.availability
  ) {
    alert("Please rate all categories before submitting.");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");

    const payload = {
      doctorId,
      communication: ratings.communication,
      support: ratings.support,
      guidance: ratings.guidance,
      availability: ratings.availability,
      additionalFeedback: feedback,
      questionnaire
    };

    await axios.post(`${BASE_URL}/ratings`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Rating submitted successfully.");
    navigate("/");
    
  } catch (err) {
    if (err.response?.status === 409) {
      alert("You've already submitted a rating for this doctor.");
    } else {
      console.error("Rating submission failed:", err);
      alert("Failed to submit rating. Try again.");
    }
  }
};



  return (
    <div className="ratings-container  ">
      <div className="ratings-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
      </div>

      <div className="edit-section-scrollable edit-section">
        <div className="doctor-rate-info">
          <div className="doctor-rate-infoBox">
            <h3 className="rate-title">Rate {doctorData.name}</h3>
            <p className="rate-paragraph">
              Share your valuable feedback about your experience with {doctorData.name}.
            </p>
          </div>
        </div>

        <PerformanceSection
           doctorName={doctorData.name}
            ratings={ratings}
            onRatingChange={(category, value) =>
              setRatings((prev) => ({ ...prev, [category]: value }))
            }
        />

        <div className="feedback-section">
          <div className="rate-feedback-header">
            <h4 className="rate-header-title">Additional Feedback</h4>
          </div>
          <p className="rate-paragraph-box">{feedback}</p>
        </div>

        {feedbackEditable && (
          <div className="modal-overlay">
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
                className="modal-rate-textarea"
              />
            </div>
          </div>
        )}

        <div className="questionnaire-rate-section">
          <h4 className="title-questionnaire">Questionnaire</h4>
          <p className="paragraph-questionnaire">
            Share your insights to help improve the academic experience.
          </p>

          {sections.map((section, index) => (
            <div key={index} className="question-block">
              <h5 className="rate-section--title">{section.title}</h5>
              <p className="section-rate-description">{section.description}</p>

              <div className="textarea-rate-with-icon">
                <textarea
                  value={questionnaire[`${section.title}_general`] || ""}
                  onChange={(e) =>
                    handleTextareaChange(`${section.title}_general`, e.target.value)
                  }
                  name="rate-question-fieldParagraph" id="rate-question-fieldParagraph"
                />
              </div>

              {section.questions.map((q, i) => (
                <div key={i} className="question-field">
                  <p className="rate-question">{q}</p>
                  <textarea
                    value={questionnaire[`${section.title}_q${i}`] || ""}
                    onChange={(e) =>
                      handleTextareaChange(`${section.title}_q${i}`, e.target.value)
                    }
                    name="question-fieldParagraph" id="rate-question-fieldParagraph"
                  />
                </div>
              ))}
            </div>
          ))}
       <button className="save-rate-edits-btn" onClick={handleSubmit}>
          Submit
        </button>
       
        </div>
      
      
      </div>

      
    </div>
  );
};

export default RateSupervisor;










// const renderFeedbackSection = () => (
//   <>
//     <div className="feedback-section">
//       <div className="rate-feedback-header">
//         <h4 className="rate-header-title">Additional Feedback</h4>
//       </div>
//       <p className="rate-paragraph-box">{feedback}</p>
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

//         {/* <div className="modal-content">
//           <textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             className="modal-rate-textarea"
//           />
//         </div> */}
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
//           <h5 className="rate-section--title">{section.title}</h5>
//           <p className="section-rate-description">{section.description}</p>
//           <div className="textarea-rate-with-icon">
//             <textarea name="rate-question-fieldParagraph" id="rate-question-fieldParagraph"></textarea>
//           </div>
//           {section.questions.map((q, i) => (
//             <div key={i} className="question-field">
//               <p className="rate-question">{q}</p>
//              <textarea name="question-fieldParagraph" id="rate-question-fieldParagraph"></textarea>    
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
//               <hr />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="edit-section-scrollable edit-section">
//           <div className="doctor-rate-info">
//             <div className="doctor-rate-infoBox">
//                  <h3 className="rate-title">Rate Erick Bernhard</h3>
//                  <p className="rate-paragraph">Share your valuable feedback about your experience with Erick.</p>
//             </div>
           
//           </div>
//           <PerformanceSection doctorName={selectedDoctor?.name} />
//           {renderFeedbackSection()}
//           {renderQuestionnaireSection()}
//           <button className="save-rate-edits-btn">Submit</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RateSupervisor;

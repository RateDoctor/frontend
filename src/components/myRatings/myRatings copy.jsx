// import React, { useState, useEffect } from "react";
// import { FiArrowLeft, FiTrash2, FiEdit2 } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useParams, useSearchParams } from "react-router-dom";
// import female from "../../imgs/female.svg";
// import man from "../../imgs/man-ezgif.com-gif-maker.svg";
// import defaultAvatar from "../../imgs/defaultAvatar.jpg";
// import axios from "axios";
// import PerformanceSection from "../myRatings/PerformanceSection.jsx";
// // import StarsRating from "../starRating/StarRating.jsx";
// import { sections } from "./data";
// import "./myRatings.css";
// const BASE_URL = process.env.REACT_APP_API_URL;


// const MyRatings = () => {
//   const navigate = useNavigate();
//   const [ratings, setRatings] = useState([]);
//   const [selectedRating, setSelectedRating] = useState(null);
//   const [editableQuestionnaire, setEditableQuestionnaire] = useState({});
//   const [feedback, setFeedback] = useState("");
//   const [feedbackEditable, setFeedbackEditable] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [performanceRatings, setPerformanceRatings] = useState({});
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const { doctorId } = useParams();
//   const [searchParams] = useSearchParams();
//   const isNewRating = searchParams.get("new") === "true";
//   const [rating, setRating] = useState(0);


// console.log("doctorId:", doctorId);
//   const token = localStorage.getItem("authToken");
//   const userId = localStorage.getItem("userId");


// const getAvatarForDoctor = (doctor) => {
//   if (!doctor) return defaultAvatar;

//   if (doctor.profileImage && doctor.profileImage.fileUrl) {
//     return doctor.profileImage.fileUrl;
//   }

//   if (doctor.gender === "female" || doctor.gender === "woman") {
//     return female;
//   } else if (doctor.gender === "male" || doctor.gender === "man") {
//     return man;
//   }

//   return defaultAvatar;
// };

// // useEffect(() => {
// //   const fetchRatings = async () => {
// //     if (!userId || !token) {
// //       setError("Missing userId or token.");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await axios.get(`${BASE_URL}/api/ratings/users/${userId}/ratings`, {
// //         headers: {   
// //           Authorization: `Bearer ${token}`,
// //           "Cache-Control": "no-cache",
// //           Pragma: "no-cache"
// //         },
// //       });

// //       const ratingsData = response.data;

// //       // Hydrate and normalize doctor data in one step
// //       const hydratedAndNormalizedRatings = await Promise.all(
// //         ratingsData.map(async (rating) => {
// //           let doctor = rating.doctorId;

// //           if (typeof doctor === "string" || !doctor?.name) {
// //             try {
// //               const res = await axios.get(
// //                 `${BASE_URL}/api/doctors/${doctor}`,
// //                 { headers: { Authorization: `Bearer ${token}` } }
// //               );
// //               doctor = res.data.doctor;
// //             } catch (err) {
// //               console.warn("Failed to fetch doctor:", doctor, err);
// //               doctor = { name: "Unknown Doctor", _id: doctor };
// //             }
// //           }

// //           // Ensure valid doctor name fallback
// //           if (!doctor.name || typeof doctor.name !== "string" || doctor.name.trim() === "") {
// //             doctor.name = "Unnamed Doctor";
// //           }

// //           return { ...rating, doctorId: doctor };
// //         })
// //       );

// //       setRatings(hydratedAndNormalizedRatings);

// //       if (!doctorId) {
// //         setSelectedRating(null);
// //         setLoading(false);
// //         return;
// //       }

// //       // Find existing rating with matching doctorId
// //       const existingRating = hydratedAndNormalizedRatings.find((r) => {
// //         const docId = r.doctorId?._id || r.doctorId;
// //         return String(docId) === String(doctorId);
// //       });

// //       if (existingRating) {
// //         setSelectedRating(existingRating);
// //         setEditableQuestionnaire(existingRating.questionnaire || {});
// //         setFeedback(existingRating.additionalFeedback || "");
// //         setPerformanceRatings({
// //           communication: existingRating.communication,
// //           support: existingRating.support,
// //           guidance: existingRating.guidance,
// //           availability: existingRating.availability,
// //         });
// //         setRating(existingRating.stars || 0); 
// //       } else {
// //         // If no existing rating but doctorId is present, create a new one for editing
// //         const doctorRes = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const doctor = doctorRes.data.doctor;
// //         const newRating = {
// //           _id: "new",
// //           doctorId: doctor,
// //           additionalFeedback: "",
// //           questionnaire: {},
// //           performanceRatings: {},
// //         };
// //         setSelectedRating(newRating);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching ratings:", err);
// //       setError("Could not load ratings.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchRatings();
// // }, [userId, token, doctorId, isNewRating]);

// useEffect(() => {
//   const fetchRatings = async () => {
//     if (!userId || !token) {
//       setError("Missing userId or token.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${BASE_URL}/api/ratings/users/${userId}/ratings`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Cache-Control": "no-cache",
//           Pragma: "no-cache"
//         },
//       });

//       const ratingsData = response.data || [];

//       const isValidHexId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

//       const hydratedAndNormalizedRatings = await Promise.all(
//         ratingsData.map(async (rating) => {
//           let doctor = rating.doctorId;

//           // Defensive checks: null/undefined/"null"/"undefined"
//           if (!doctor || doctor === "null" || doctor === "undefined") {
//             console.warn("Rating missing doctorId:", { ratingId: rating._id, doctorId: doctor });
//             return { ...rating, doctorId: { _id: null, name: "Unknown Doctor" } };
//           }

//           // If doctor is a plain string: either an ObjectId string or a serialized object
//           if (typeof doctor === "string") {
//             // if it looks like an ObjectId, fetch doctor
//             if (isValidHexId(doctor)) {
//               try {
//                 const res = await axios.get(`${BASE_URL}/api/doctors/${doctor}`, {
//                   headers: { Authorization: `Bearer ${token}` },
//                 });
//                 doctor = res.data?.doctor || { _id: doctor, name: "Unknown Doctor" };
//               } catch (err) {
//                 console.warn("Failed to fetch doctor by id:", doctor, err);
//                 doctor = { _id: doctor, name: "Unknown Doctor" };
//               }
//             } else {
//               // try parsing in case backend accidentally stored JSON string
//               try {
//                 const parsed = JSON.parse(doctor);
//                 doctor = parsed && parsed._id ? parsed : { _id: null, name: parsed?.name || "Unknown Doctor" };
//               } catch (e) {
//                 doctor = { _id: null, name: "Unknown Doctor" };
//               }
//             }
//           } else {
//             // doctor is an object; ensure we have a name fallback
//             if (!doctor.name) doctor.name = doctor._id ? "Unnamed Doctor" : "Unknown Doctor";
//           }

//           return { ...rating, doctorId: doctor };
//         })
//       );

//       setRatings(hydratedAndNormalizedRatings);

//       // keep existing logic that sets selectedRating when doctorId param is present
//       if (!doctorId) {
//         setSelectedRating(null);
//         setLoading(false);
//         return;
//       }

//       const existingRating = hydratedAndNormalizedRatings.find((r) => {
//         const docId = r.doctorId?._id || r.doctorId;
//         return String(docId) === String(doctorId);
//       });

//       if (existingRating) {
//         setSelectedRating(existingRating);
//         setEditableQuestionnaire(existingRating.questionnaire || {});
//         setFeedback(existingRating.additionalFeedback || "");
//         setPerformanceRatings({
//           communication: existingRating.communication,
//           support: existingRating.support,
//           guidance: existingRating.guidance,
//           availability: existingRating.availability,
//         });
//         setRating(existingRating.stars || 0);
//       } else {
//         // existing fallback when no rating found
//         try {
//           const doctorRes = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const doctor = doctorRes.data.doctor;
//           const newRating = {
//             _id: "new",
//             doctorId: doctor,
//             additionalFeedback: "",
//             questionnaire: {},
//             performanceRatings: {},
//           };
//           setSelectedRating(newRating);
//         } catch (err) {
//           console.warn("Couldn't fetch doctor for new rating:", doctorId, err);
//           setSelectedRating({
//             _id: "new",
//             doctorId: { _id: doctorId, name: "Unknown Doctor" },
//             additionalFeedback: "",
//             questionnaire: {},
//             performanceRatings: {},
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching ratings:", err);
//       setError("Could not load ratings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchRatings();
// }, [userId, token, doctorId, isNewRating]);



//   useEffect(() => {
//     document.body.classList.toggle("no-scroll", feedbackEditable);
//     return () => document.body.classList.remove("no-scroll");
//   }, [feedbackEditable]);





// const handleSaveStars = async (starsParam) => {
//   if (!selectedRating) return;
//   setIsSaving(true);

//   const doctorIdToSend =
//     typeof selectedRating.doctorId === "string"
//       ? selectedRating.doctorId
//       : selectedRating.doctorId?._id;

//   if (!doctorIdToSend) {
//     console.error("Invalid doctorId", selectedRating.doctorId);
//     setIsSaving(false);
//     return;
//   }

//   const starsToSend = typeof starsParam === "number" ? starsParam : rating;

//   if (starsToSend < 1 || starsToSend > 5) {
//     alert("Rating must be between 1 and 5 stars.");
//     setIsSaving(false);
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${BASE_URL}/api/ratings/star`,
//       {
//         doctorId: doctorIdToSend,
//         stars: starsToSend,
//         additionalFeedback: feedback || "",
//         questionnaire: editableQuestionnaire || {},
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const updatedRating = response.data;

//     // Normalize doctor field so we always have an object with _id and name
//     const normalizeRating = (ratingObj) => {
//       const doctor = typeof ratingObj.doctorId === "string"
//         ? { _id: ratingObj.doctorId, name: selectedRating?.doctorId?.name || "Unnamed Doctor" }
//         : ratingObj.doctorId || { _id: doctorIdToSend, name: selectedRating?.doctorId?.name || "Unnamed Doctor" };
//       return { ...ratingObj, doctorId: doctor };
//     };

//     const normalized = normalizeRating(updatedRating);

//     // Update local ratings list (replace existing rating doc or add)
//     setRatings((prev) => {
//       const exists = prev.some((r) => r._id === normalized._id);
//       if (exists) {
//         return prev.map((r) => (r._id === normalized._id ? normalized : r));
//       } else {
//         return [...prev, normalized];
//       }
//     });

//     setSelectedRating(normalized);
//     setRating(starsToSend); // keep UI in sync

//     // --- NEW: obtain updated doctor rating and broadcast it ---
//     let updatedDoctorRating = null;
// const updatedDoctor = normalized.doctorId;

// if (updatedDoctor && typeof updatedDoctor === "object" && updatedDoctor.rating != null) {
//   updatedDoctorRating = Number(updatedDoctor.rating);
// } else {
//   try {
//     const docRes = await axios.get(`${BASE_URL}/api/doctors/${doctorIdToSend}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     updatedDoctorRating = Number(docRes.data?.doctor?.rating ?? docRes.data?.doctor?.averageRating ?? docRes.data?.rating ?? 0);
//   } catch (err) {
//     updatedDoctorRating = Number(starsToSend);
//   }
// }
//     // Dispatch global event so other components can update their local lists
//     try {
//       window.dispatchEvent(
//         new CustomEvent("doctorRatingUpdated", {
//           detail: { doctorId: String(doctorIdToSend), rating: updatedDoctorRating }
//         })
//       );
//     } catch (e) {
//       console.warn("Failed to dispatch doctorRatingUpdated event:", e);
//     }
//     // --- end broadcast ---

//     setShowSuccessPopup(true);
//     setTimeout(() => setShowSuccessPopup(false), 1500);
//   } catch (err) {
//     console.error("Failed to save stars:", err.response?.data || err);
//     const serverMsg = err.response?.data?.error || err.response?.data || err.message;
//     alert(`Failed to save stars: ${serverMsg}`);
//   } finally {
//     setIsSaving(false);
//   }
// };





//     const handleSelectRating = (rating) => {
//     setSelectedRating(rating);
//     setEditableQuestionnaire(rating.questionnaire || {});
//     setFeedback(rating.additionalFeedback || "");
//     setPerformanceRatings({
//       communication: rating.communication,
//       support: rating.support,
//       guidance: rating.guidance,
//       availability: rating.availability,
//     });
//   };

//   const handleDeleteRating = async (ratingId) => {
//     if (!window.confirm("Are you sure you want to delete this rating?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/ratings/${ratingId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRatings((prev) => prev.filter((r) => r._id !== ratingId));
//       setSelectedRating(null);
//     } catch (err) {
//       console.error("Failed to delete rating:", err);
//       alert("Failed to delete rating.");
//     }
//   };



//   function buildQuestionnaire(flatObj) {
//   return {
//     teachingStyle: {
//       description: flatObj[sections[0].title] || "",
//       complexConcepts: flatObj[sections[0].questions[0]] || "",
//       criticalThinking: flatObj[sections[0].questions[1]] || ""
//     },
//     responsiveness: {
//       responsiveness: flatObj[sections[1].title] || "",
//       feedbackTurnaround: flatObj[sections[1].questions[0]] || "",
//       constructiveFeedback: flatObj[sections[1].questions[1]] || ""
//     },
//     mentorship: {
//       researchGuidance: flatObj[sections[2].questions[0]] || "",
//       methodologySupport: flatObj[sections[2].questions[1]] || "",
//       professionalDevelopment: flatObj[sections[2].questions[2]] || ""
//     },
//     overallSupport: {
//       overallSupport: flatObj[sections[3].questions[0]] || "",
//       academicChallenges: flatObj[sections[3].questions[1]] || "",
//       contributionToSuccess: flatObj[sections[3].questions[2]] || ""
//     }
//   };
// }



// // const handleSaveFeedback = async () => {
// //   if (!selectedRating) return;

// //   setIsSaving(true);

  
// //   const questionnairePayload = buildQuestionnaire(editableQuestionnaire, sections);

// //    try {
// //     if (selectedRating._id === "new") {
// //       const response = await axios.post(
// //         `${BASE_URL}/api/ratings/detailed`,
// //         {
// //           doctorId: selectedRating.doctorId._id,
// //           communication: performanceRatings.communication,
// //           support:       performanceRatings.support,
// //           guidance:      performanceRatings.guidance,
// //           availability:  performanceRatings.availability,
// //           additionalFeedback: feedback,
// //           questionnaire: editableQuestionnaire,
// //         },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );


// //       let newRating = response.data;
// //       setRatings((prev) => [...prev, newRating]);
// //       setSelectedRating(newRating);

// //     }  else {
// //       await axios.put(
// //         `${BASE_URL}/api/ratings/${selectedRating._id}`,
// //         {
// //           additionalFeedback: feedback,
// //           questionnaire: editableQuestionnaire,
// //           performanceRatings,
// //         },
// //         { headers: { Authorization: `Bearer ${token}` } }

        
// //       );
// //       const updatedRating = {
// //         ...selectedRating,
// //         additionalFeedback: feedback,
// //         questionnaire: questionnairePayload,
// //         performanceRatings,
// //       };
// //       setSelectedRating(updatedRating);
// //       setRatings((prev) =>
// //         prev.map((r) => (r._id === selectedRating._id ? updatedRating : r))
// //       );
// //     }

// //     setFeedbackEditable(false);
// //     setShowSuccessPopup(true);
// //     setTimeout(() => {
// //       setShowSuccessPopup(false);
// //       navigate(-1);  
// //     }, 1500);


// //   } catch (err) {
// //     console.error("Failed to save feedback:", err);
// //     alert("Failed to save feedback.");
// //   }finally {
// //     setIsSaving(false);
// //   }
// // };

// // ---------- handleSaveFeedback ----------


// const handleSaveFeedback = async () => {
//   if (!selectedRating) return;

//   setIsSaving(true);

//   const questionnairePayload = buildQuestionnaire(editableQuestionnaire, sections);

//   // compute doctorId robustly (handles string or object)
//   const doctorIdToSend =
//     typeof selectedRating?.doctorId === "string"
//       ? selectedRating.doctorId
//       : selectedRating?.doctorId?._id;

//   try {
//     if (selectedRating._id === "new") {
//       // Validate doctor id before POST
//       if (!doctorIdToSend) {
//         throw new Error("Cannot save: invalid doctor id for new rating.");
//       }

//       const response = await axios.post(
//         `${BASE_URL}/api/ratings/detailed`,
//         {
//           doctorId: doctorIdToSend,
//           communication: performanceRatings.communication,
//           support: performanceRatings.support,
//           guidance: performanceRatings.guidance,
//           availability: performanceRatings.availability,
//           additionalFeedback: feedback,
//           questionnaire: editableQuestionnaire,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newRating = response.data;
//       // ensure normalized doctor object
//       const normalized = {
//         ...newRating,
//         doctorId:
//           typeof newRating.doctorId === "string"
//             ? { _id: newRating.doctorId, name: selectedRating?.doctorId?.name || "Unnamed Doctor" }
//             : newRating.doctorId || { _id: doctorIdToSend, name: selectedRating?.doctorId?.name || "Unnamed Doctor" }
//       };

//       setRatings((prev) => [...prev, normalized]);
//       setSelectedRating(normalized);
//     } else {
//       // existing rating -> update via PUT
//       await axios.put(
//         `${BASE_URL}/api/ratings/${selectedRating._id}`,
//         {
//           additionalFeedback: feedback,
//           questionnaire: editableQuestionnaire,
//           performanceRatings,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedRating = {
//         ...selectedRating,
//         additionalFeedback: feedback,
//         questionnaire: questionnairePayload,
//         communication: performanceRatings.communication,
//         support: performanceRatings.support,
//         guidance: performanceRatings.guidance,
//         availability: performanceRatings.availability,
//       };

//       setSelectedRating(updatedRating);
//       setRatings((prev) =>
//         prev.map((r) => (r._id === selectedRating._id ? updatedRating : r))
//       );
//     }

//     setFeedbackEditable(false);
//     setShowSuccessPopup(true);
//     setTimeout(() => {
//       setShowSuccessPopup(false);
//       navigate(-1);
//     }, 1500);
//   } catch (err) {
//     console.error("Failed to save feedback:", err);

//     // If backend returns 409, attempt fallback update: find existing rating and PUT
//     if (err.response?.status === 409 && doctorIdToSend) {
//       try {
//         // fetch all user ratings and find the one for this doctor
//         const existingResp = await axios.get(`${BASE_URL}/api/ratings/users/${userId}/ratings`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const existingForDoctor = existingResp.data.find((r) =>
//           String(r.doctorId?._id || r.doctorId) === String(doctorIdToSend)
//         );

//         if (existingForDoctor) {
//           // update found rating
//           await axios.put(
//             `${BASE_URL}/api/ratings/${existingForDoctor._id}`,
//             {
//               additionalFeedback: feedback,
//               questionnaire: editableQuestionnaire,
//               performanceRatings,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           const updatedRating = {
//             ...existingForDoctor,
//             additionalFeedback: feedback,
//             questionnaire: questionnairePayload,
//             communication: performanceRatings.communication,
//             support: performanceRatings.support,
//             guidance: performanceRatings.guidance,
//             availability: performanceRatings.availability,
//           };

//           setRatings((prev) => prev.map((r) => (r._id === updatedRating._id ? updatedRating : r)));
//           setSelectedRating(updatedRating);

//           setFeedbackEditable(false);
//           setShowSuccessPopup(true);
//           setTimeout(() => {
//             setShowSuccessPopup(false);
//             navigate(-1);
//           }, 1200);

//           setIsSaving(false);
//           return;
//         } else {
//           // no existing rating found — rethrow original error for alert below
//           console.warn("Conflict received but no existing rating found to update.");
//         }
//       } catch (innerErr) {
//         console.error("Fallback update failed:", innerErr);
//         alert("Failed to save feedback due to conflict; fallback update failed.");
//         setIsSaving(false);
//         return;
//       }
//     }

//     // generic failure path
//     const serverMsg = err.response?.data?.error || err.response?.data || err.message;
//     alert(`Failed to save feedback: ${serverMsg}`);
//   } finally {
//     setIsSaving(false);
//   }
// };




// const renderDoctorList = () => {


//   console.log("Ratings in renderDoctorList:", ratings);
// console.log("Ratings with missing doctor or name:", ratings.filter(r => !r.doctorId || !r.doctorId.name));

// if (loading) {
//   return (
//     <div className="ratings-loading-center">
//       <div className="spinner" />
//       <p>Loading doctors...</p>
//     </div>
//   );
// }

//   return (
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
//             <img
//               src={getAvatarForDoctor(doctor)}
//               alt={doctor.name || "Doctor Avatar"}
//               className="doctor-img"
//             />
//             <span className="doctor-name">
//               {doctor.name}
//             </span>
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
// };



//   const renderFeedbackSection = () => (
//     <div className="feedback-section">
//       <div className="feedback-header">
//         <h4 className="my-rating-title-header">Additional Feedback</h4>
//         <FiEdit2 className="penFeedback" onClick={() => setFeedbackEditable(true)} />
//       </div>
//       <textarea
//         value={feedback}
//         onChange={(e) => setFeedback(e.target.value)}
//         className="modal-textarea"
//         rows={6}
//         placeholder="Write your feedback here..."
//       />
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
//     </div>
//   );

//   const renderQuestionnaireSection = () => (
//     <div className="questionnaire-section">
//       <h4 className="title-questionnaire">Questionnaire</h4>
//       <p className="paragraph-questionnaire">
//         Share your thoughts and insights by completing the questionnaire.
//       </p>
//       {sections.map((section, index) => {
//         const showTrash = ["Teaching Style", "Responsiveness", "Mentorship"].includes(section.title);
//         return (
//           <div key={index} className="question-block">
//             <h5>{section.title}</h5>
//             <p className="section-description">{section.description}</p>
//             <div className="textarea-with-trash">
//               <textarea
//                 placeholder={section.firstPlaceholder}
//                 value={editableQuestionnaire[section.title] || ""}
//                 onChange={(e) =>
//                   setEditableQuestionnaire((prev) => ({
//                     ...prev,
//                     [section.title]: e.target.value,
//                   }))
//                 }
//               />
//               {showTrash && (
//                 <FiTrash2
//                   className="trash-icon"
//                   onClick={() =>
//                     setEditableQuestionnaire((prev) => ({
//                       ...prev,
//                       [section.title]: "",
//                     }))
//                   }
//                 />
//               )}
//             </div>
            
//             {section.questions.map((q, i) => (
//               <div key={i} className="question-field">
//                 <p>{q}</p>
//                 <textarea
//                   className="question-fieldParagraph"
//                   value={editableQuestionnaire[q] || ""}
//                   onChange={(e) =>
//                     setEditableQuestionnaire((prev) => ({
//                       ...prev,
//                       [q]: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
              
//             ))}
//           </div>
//         );
//       })}

//       <button className="save-edits-btn" onClick={handleSaveFeedback} >
//         Save Edits
//       </button>
      
//     </div>
//   );

//   const renderEditor = () => (
//     <div className="edit-section-scrollable edit-section" >
//       <div className="doctor-info">
//         <div className="doctor-infoBox">
//           <img
//             // src={selectedRating?.doctorId?.profileImage?.fileUrl || "/default-avatar.png"}
//             src={getAvatarForDoctor(selectedRating?.doctorId)}
//             alt={selectedRating?.doctorId?.name || "Doctor Avatar"}
//             className="doctor-img"
//           />
//           <h3>{selectedRating?.doctorId?.name || "Unnamed Doctor"}</h3>
//         </div>
//         <button className="delete-btn" 
//             onClick={(e) => {
//             e.stopPropagation();
//             handleDeleteRating(selectedRating._id); 
//             }}
//           >
//           Delete
//         </button>
        
//       </div>

//        {/* <StarsRating
//         rating={rating}
//         setRating={setRating}
//         editable={true}
//         onSave={handleSaveStars}
//       /> */}

//       <StarsRating
//         rating={rating}
//         setRating={setRating}
//         editable={true}
//         onSave={handleSaveStars}
//       />

            
//       <PerformanceSection
//         doctorName={selectedRating?.doctorId?.name}
//         ratings={performanceRatings}
        
//         onRatingChange={(category, value) =>
//           setPerformanceRatings((prev) => ({
//             ...prev,
//             [category]: value,
//           }))
//         }
//       />
//       {renderFeedbackSection()}
//       {renderQuestionnaireSection()}
      

//     </div>
//   );

//     return (
//   <div className="ratings-container">
//     <div className="ratings-header">
//       <FiArrowLeft
//         className="back-icon"
//         onClick={() => {
//           if (selectedRating) {
//             setSelectedRating(null);
//             setFeedbackEditable(false);
//           } else {
//             navigate(-1);
//           }

          
//         }}
//       />
//       <h2>My Ratings</h2>
//     </div>

    

//     {loading && <p>Loading ratings...</p>}
//     {error && <p className="error">{error}</p>}

//     {/* ✅ This is the main conditional rendering block */}
//     {!loading && !error && (
//       selectedRating ? renderEditor() : renderDoctorList()
//     )}

//     {/* ✅ Saving and Success Popups */}
//     {isSaving && (
//       <div className="popup-overlay">
//         <div className="popup-box">
//           <div className="spinner" />
//           <p>Saving your feedback...</p>
//         </div>
//       </div>
//     )}

//     {showSuccessPopup && (
//       <div className="popup-overlay">
//         <div className="popup-box success">
//           <span className="checkmark">✅</span>
//           <p>Saved successfully!</p>
//         </div>
//       </div>
//     )}
//   </div>
// );

  
// };

// export default MyRatings;




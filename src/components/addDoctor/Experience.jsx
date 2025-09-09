import { FaPlus, FaTrash } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import { useState, useEffect } from "react";

const Experience = ({ formData, setFormData }) => {
  const [showCalendarFor, setShowCalendarFor] = useState(null);

  // Normalize experience array if it contains strings
  useEffect(() => {
    if (!Array.isArray(formData.experience)) return;

    const needsNormalization = formData.experience.some(
      exp => typeof exp === "string"
    );

    if (needsNormalization) {
      const normalized = formData.experience.map(exp =>
        typeof exp === "string" ? { description: exp, date: "" } : exp
      );
      setFormData(f => ({ ...f, experience: normalized }));
    }
  }, [formData.experience, setFormData]);

  // Add a new empty experience
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { description: "", date: "" }]
    }));
  };

  // Update experience description or date
  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(f => ({ ...f, experience: updated }));
  };

  // Remove an experience
  const removeExperience = index => {
    const updated = formData.experience.filter((_, i) => i !== index);
    setFormData(f => ({ ...f, experience: updated }));
  };

  return (
    <div className="experience-container">
      <label className="top-one-line label-addDoctor">
        <span className="title">Experience</span>
        <span className="plus-icon" onClick={addExperience}><FaPlus /></span>
      </label>

      {formData.experience.map((exp, index) => (
        <div key={index} className="input-with-icon">
          <input
            className="inputAddDoctor"
            placeholder="Add experience"
            value={exp.description || ""}
            onChange={e => updateExperience(index, "description", e.target.value)}
          />

          <span
            className="calendar-icon"
            onClick={() =>
              setShowCalendarFor(showCalendarFor === index ? null : index)
            }
          >
            <RxCalendar />
          </span>

          {showCalendarFor === index && (
            <div className="calendar-popup">
              <input
                type="date"
                value={exp.date || ""}
                onChange={e => updateExperience(index, "date", e.target.value)}
              />
            </div>
          )}

          <span
            className="trash-icon"
            onClick={() => removeExperience(index)}
          >
            <FaTrash />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Experience;



// import { FaPlus } from "react-icons/fa6";
// import { RxCalendar } from "react-icons/rx";
// import { useState } from "react";

// const Experience = ({ formData, setFormData }) => {
//   const [calendarFor, setCalendarFor] = useState({ field: null, idx: null });
//   const [showCalendarFor, setShowCalendarFor] = useState(null);

//   return (
//     <div>
//       <label className="top-one-line label-addDoctor">
//         <span className="title">Experience</span>
//         <span className="plus-icon" onClick={() => setFormData(prev => ({
//           ...prev,
//           experience: [...prev.experience, '']
//         }))}><FaPlus /></span>
//       </label>

//       {formData.experience.map((exp, index) => (
//         <div key={index} className="input-with-icon">
//           <input
//             className="inputAddDoctor"
//             placeholder="Add experience"
//             value={exp}
//             onChange={e => {
//               const updated = [...formData.experience];
//               updated[index] = e.target.value;
//               setFormData(f => ({ ...f, experience: updated }));
//             }}
//           />

//           <span className="calendar-icon" onClick={() =>
//             setShowCalendarFor(showCalendarFor === `exp-${index}` ? null : `exp-${index}`)
//           }><RxCalendar /></span>

//           {showCalendarFor === `exp-${index}` && (
//             <div className="calendar-popup">
//               <input
//                 type="date"
//                 onChange={e => {
//                   const updated = [...formData.experience];
//                   updated[index] = e.target.value;
//                   setFormData(f => ({ ...f, experience: updated }));
//                   setShowCalendarFor(null);
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Experience;

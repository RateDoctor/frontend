import { FaPlus } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import { useState } from "react";

const Experience = ({ formData, setFormData }) => {
  const [calendarFor, setCalendarFor] = useState({ field: null, idx: null });
  const [showCalendarFor, setShowCalendarFor] = useState(null);

  return (
    <div>
      <label className="top-one-line label-addDoctor">
        <span className="title">Experience</span>
        <span className="plus-icon" onClick={() => setFormData(prev => ({
          ...prev,
          experience: [...prev.experience, '']
        }))}><FaPlus /></span>
      </label>

      {formData.experience.map((exp, index) => (
        <div key={index} className="input-with-icon">
          <input
            className="inputAddDoctor"
            placeholder="Add experience"
            value={exp}
            onChange={e => {
              const updated = [...formData.experience];
              updated[index] = e.target.value;
              setFormData(f => ({ ...f, experience: updated }));
            }}
          />

          <span className="calendar-icon" onClick={() =>
            setShowCalendarFor(showCalendarFor === `exp-${index}` ? null : `exp-${index}`)
          }><RxCalendar /></span>

          {showCalendarFor === `exp-${index}` && (
            <div className="calendar-popup">
              <input
                type="date"
                onChange={e => {
                  const updated = [...formData.experience];
                  updated[index] = e.target.value;
                  setFormData(f => ({ ...f, experience: updated }));
                  setShowCalendarFor(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Experience;

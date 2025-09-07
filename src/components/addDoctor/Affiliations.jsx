import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";

const Affiliations = ({ formData, setFormData, universities }) => {
  const universityRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null); // track dropdown per index
  const [showCalendarFor, setShowCalendarFor] = useState(null); // track calendar per index

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (universityRef.current && !universityRef.current.contains(e.target)) {
        setIsDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add new affiliation
  const addAffiliation = () => {
    setFormData((prev) => ({
      ...prev,
      affiliations: [
        ...prev.affiliations,
        { universityId: "", name: "", joined: "" },
      ],
    }));
  };

  // Update a specific affiliation
  const updateAffiliation = (index, key, value) => {
    const updated = [...formData.affiliations];
    updated[index][key] = value;
    setFormData({ ...formData, affiliations: updated });
  };

  return (
    <div>
      <label className="top-one-line label-addDoctor">
        <span className="title">Affiliations</span>
        <span className="plus-icon" onClick={addAffiliation}>
          <FaPlus />
        </span>
      </label>

      {formData.affiliations.map((aff, index) => (
        <div key={index} className="input-with-icon" ref={universityRef}>
          {/* Input for affiliation name */}
          <input
            className="inputAddDoctor"
            placeholder="Search or type affiliation"
            value={aff.name}
            onChange={(e) => {
              updateAffiliation(index, "name", e.target.value);
              setIsDropdownOpen(index);
            }}
          />

          {/* Calendar for joined date */}
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
                value={aff.joined?.slice(0, 10) || ""} 
                onChange={(e) => {
                  updateAffiliation(index, "joined", e.target.value);
                  setShowCalendarFor(null);
                }}
              />
            </div>
          )}

          {/* Autocomplete dropdown */}
          {isDropdownOpen === index && (
            <ul className="autocomplete-dropdown">
              {universities
                .filter((u) =>
                  u.name.toLowerCase().includes(aff.name.toLowerCase())
                )
                .map((u) => (
                  <li
                    key={u._id}
                    onClick={() => {
                      updateAffiliation(index, "name", u.name);
                      updateAffiliation(index, "universityId", u._id);
                      setIsDropdownOpen(null);
                    }}
                  >
                    {u.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Affiliations;


// import { useState, useRef, useEffect } from "react";
// import { FaPlus } from "react-icons/fa6";
// import { RxCalendar } from "react-icons/rx";

// const Affiliations = ({ formData, setFormData, universities }) => {
//   const universityRef = useRef(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showCalendarFor, setShowCalendarFor] = useState(null);

//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (universityRef.current && !universityRef.current.contains(e.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div>
//       <label className='top-one-line label-addDoctor'>
//         <span className='title'>Affiliations</span>
//         <span className="plus-icon" onClick={() => setFormData(prev => ({
//           ...prev,
//           affiliations: [...prev.affiliations, { name: '', joined: '' }]
//         }))}><FaPlus /></span>
//       </label>

//       {formData.affiliations.map((aff, index) => (
//         <div key={index} className="input-with-icon" ref={universityRef}>
//           <input
//             className="inputAddDoctor"
//             placeholder="Search or type affiliation"
//             value={aff.name}
//             onChange={(e) => {
//               const updated = [...formData.affiliations];
//               updated[index].name = e.target.value;
//               setFormData({ ...formData, affiliations: updated });
//               setIsDropdownOpen(true);
//             }}
//           />
//           <span className="calendar-icon" onClick={() => setShowCalendarFor(`aff-${index}`)}><RxCalendar /></span>
//           {showCalendarFor === `aff-${index}` && (
//             <div className="calendar-popup">
//               <input
//                 type="date"
//                 value={aff.joined}
//                 onChange={(e) => {
//                   const updated = [...formData.affiliations];
//                   updated[index].joined = e.target.value;
//                   setFormData({ ...formData, affiliations: updated });
//                   setShowCalendarFor(null);
//                 }}
//               />
//             </div>
//           )}

//           {isDropdownOpen && (
//             <ul className="autocomplete-dropdown">
//              {universities
//               .filter(u => u.name.toLowerCase().includes(aff.name.toLowerCase()))
//               .map(u => (
//                 <li key={u._id} onClick={() => {
//                   const updated = [...formData.affiliations];
//                   updated[index].name = u.name;

//                   setFormData({ 
//                     ...formData, 
//                     affiliations: updated,
//                     universityId: u._id // ✅ store the universityId for backend
//                   });

//                   setIsDropdownOpen(false);
//                 }}>{u.name}</li>
//               ))}

//             </ul>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Affiliations;

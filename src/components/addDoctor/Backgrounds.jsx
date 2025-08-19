import React from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const Backgrounds = ({ formData, setFormData, fields, setFields }) => {
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  // const saveBackground = async (value, index) => {
  //   const name = capitalize(value.trim());
  //   if (!name) return;

  //   const existing = fields.find(f => f.name.toLowerCase() === name.toLowerCase());
  //   let fieldId = existing?._id;

  //   if (!existing) {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const res = await axios.post(
  //         `${BASE_URL}/api/fields`,
  //         { name },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       fieldId = res.data._id;
  //       setFields(prev => [...prev, res.data]);
  //     } catch (err) {
  //       console.error("Failed to save field:", err);
  //       alert("Failed to save field.");
  //       return;
  //     }
  //   }

  //   // Update formData with new field
  //   setFormData(prev => {
  //     const updatedBackgrounds = [...prev.backgrounds];
  //     updatedBackgrounds[index] = name;

  //     return {
  //       ...prev,
  //       backgrounds: updatedBackgrounds,
  //       fieldOfStudyId: index === 0 ? fieldId : prev.fieldOfStudyId
  //     };
  //   });
  // };


  const saveBackground = async (value, index) => {
  const name = capitalize(value.trim());
  if (!name) return;

  const existing = fields.find(f => f.name.toLowerCase() === name.toLowerCase());
  let fieldId = existing?._id;

  if (!existing) {
    try {
      const token = localStorage.getItem("authToken");

      // ✅ Include university (from formData or selected dropdown)
      const payload = {
        name,
        university: formData.universityId, // <-- IMPORTANT
      };

      const res = await axios.post(
        `${BASE_URL}/api/fields`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fieldId = res.data._id;
      setFields(prev => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Failed to save field:", err.response?.data || err);
      alert("Failed to save field.");
      return;
    }
  }

  // Update formData
  setFormData(prev => {
    const updatedBackgrounds = [...prev.backgrounds];
    updatedBackgrounds[index] = name;

    return {
      ...prev,
      backgrounds: updatedBackgrounds,
      fieldOfStudyId: index === 0 ? fieldId : prev.fieldOfStudyId,
    };
  });
};

  const handleChange = (value, index) => {
    setFormData(prev => {
      const updated = [...prev.backgrounds];
      updated[index] = value;

      // reset primary field id if first field is being changed
      return index === 0
        ? { ...prev, backgrounds: updated, fieldOfStudyId: "" }
        : { ...prev, backgrounds: updated };
    });
  };

  const handleAddBackground = () => {
    setFormData(prev => ({
      ...prev,
      backgrounds: [...prev.backgrounds, ""]
    }));
  };

  return (
    <div>
      <label className="top-one-line label-addDoctor">
        <span className="title">Background (Field of Study)</span>
        <span className="plus-icon" onClick={handleAddBackground}><FaPlus /></span>
      </label>

      {formData.backgrounds.map((bg, index) => (
        <div key={index} className="input-with-icon">
          <input
            className="inputAddDoctor"
            placeholder={index === 0 ? "Primary field of study" : "Add background info"}
            value={bg}
            onChange={e => handleChange(e.target.value, index)}
            onBlur={e => saveBackground(e.target.value, index)}
            onKeyDown={e => e.key === "Enter" && saveBackground(e.target.value, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default Backgrounds;




// import { FaPlus } from "react-icons/fa6";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL;

// const Backgrounds = ({ formData, setFormData, fields, setFields }) => {
//   const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

//   const handleEnter = async (e, index, bg) => {
//     if (e.key === 'Enter' && index === 0 && bg.trim()) {
//       const match = fields.find(f => f.name.toLowerCase() === bg.toLowerCase());
//       if (!match) {
//         try {
//           const token = localStorage.getItem("authToken");
//           const response = await axios.post(
//             `${BASE_URL}/api/fields`,
//             { name: capitalizeFirstLetter(bg) },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           const newField = response.data;
//           setFields(prev => [...prev, newField]);
//           setFormData(prev => ({ ...prev, fieldOfStudyId: newField._id }));
//         } catch (err) {
//           console.error(err);
//           alert("Failed to save field. Please try again.");
//         }
//       } else {
//         setFormData(prev => ({ ...prev, fieldOfStudyId: match._id }));
//       }
//     }
//   };

//   return (
//     <div>
//       <label className="top-one-line label-addDoctor">
//         <span className="title">Background</span>
//         <span className="plus-icon" onClick={() =>
//           setFormData(prev => ({ ...prev, backgrounds: [...prev.backgrounds, ''] }))
//         }><FaPlus /></span>
//       </label>

//       {formData.backgrounds.map((bg, index) => (
//         <div key={index} className="input-with-icon">
//           <input
//             className="inputAddDoctor"
//             placeholder={index === 0 ? "Primary field of study (auto-saved)" : "Add background info"}
//             value={bg}
//             onChange={e => {
//               const updated = [...formData.backgrounds];
//               updated[index] = e.target.value;
//               setFormData({ ...formData, backgrounds: updated });
//               if (index === 0) setFormData(prev => ({ ...prev, fieldOfStudyId: '' }));
//             }}
//             onKeyDown={(e) => handleEnter(e, index, bg)}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Backgrounds;

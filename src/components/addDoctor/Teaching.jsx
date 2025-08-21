import React from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const Teaching = ({ formData, setFormData, topics, setTopics }) => {
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  const saveTopic = async (value, index) => {
  const name = capitalize(value.trim());
  if (!name) return; 
  if (!formData.fieldOfStudyId) 
  { 
    alert("Please select a Field of Study before adding topics.");
    return;
  }

      

    const existing = topics.find(
      t => t.name.toLowerCase() === name.toLowerCase() && t.field === formData.fieldOfStudyId
    );

    let topicId = existing?._id || null;

    if (!existing) {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          `${BASE_URL}/api/topics`,
          { name, fieldOfStudyId: formData.fieldOfStudyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        topicId = res.data._id;
        setTopics(prev => [...prev, res.data]);
      } catch (err) {
        console.error(err);
        alert("Failed to save topic.");
        return;
      }
    }

    const updatedTeaching = [...formData.teaching];
    const updatedTopicIds = [...formData.topicIds];

    updatedTeaching[index] = name;
    updatedTopicIds[index] = topicId;

    setFormData(prev => ({
      ...prev,
      teaching: updatedTeaching,
      topicIds: updatedTopicIds
    }));
  };

  const handleChange = (value, index) => {
    const updated = [...formData.teaching];
    updated[index] = value;
    setFormData(prev => ({ ...prev, teaching: updated }));
  };

  // const handleBlur = (value, index) => saveTopic(value, index); // save on blur
   const handleBlur = () => {}; 

  const handleAddTopic = () => {
    setFormData(prev => ({
      ...prev,
      teaching: [...prev.teaching, ""],
      topicIds: [...prev.topicIds, null]
    }));
  };

  const handleRemoveTopic = index => {
    setFormData(prev => ({
      ...prev,
      teaching: prev.teaching.filter((_, i) => i !== index),
      topicIds: prev.topicIds.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="teaching-section">
      <label className="top-one-line label-addDoctor">
        <span className="title">Teaching (Topics)</span>
        <span className="plus-icon" onClick={handleAddTopic}><FaPlus /></span>
      </label>

      {formData.teaching.map((topic, index) => (
        <div key={index} className="input-with-icon">
          <input
            className="inputAddDoctor"
            placeholder={index === 0 ? "Primary topic" : "Add teaching topic"}
            value={topic}
            onChange={e => handleChange(e.target.value, index)}
            onBlur={e => handleBlur(e.target.value, index)}
            onKeyDown={e => e.key === "Enter" && saveTopic(e.target.value, index)}
          />
          {topic && <button type="button" onClick={() => handleRemoveTopic(index)}>Remove</button>}
        </div>
      ))}
    </div>
  );
};

export default Teaching;




// import { FaPlus } from "react-icons/fa6";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL;

// const Teaching = ({ formData, setFormData, topics, setTopics, fields }) => {
//   const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

//   const handleEnter = async (e, index, topic) => {
//     if (e.key !== 'Enter' || !topic.trim()) return;
//     const existingTopic = topics.find(t => t.name.toLowerCase() === topic.toLowerCase() && t.field === formData.fieldOfStudyId);

//     if (!existingTopic && formData.fieldOfStudyId) {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.post(`${BASE_URL}/api/topics`, { name: capitalizeFirstLetter(topic), fieldId: formData.fieldOfStudyId }, { headers: { Authorization: `Bearer ${token}` } });
//         const newTopic = response.data;
//         setTopics(prev => [...prev, newTopic]);
//         const updatedTopicIds = [...formData.topicIds];
//         updatedTopicIds[index] = newTopic._id;
//         setFormData(prev => ({ ...prev, topicIds: updatedTopicIds }));
//       } catch (err) { console.error(err); alert("Failed to save teaching topic."); }
//     } else if (existingTopic) {
//       const updatedTopicIds = [...formData.topicIds];
//       updatedTopicIds[index] = existingTopic._id;
//       setFormData(prev => ({ ...prev, topicIds: updatedTopicIds }));
//     }
//   };

//   return (
//     <div>
//       <label className='top-one-line label-addDoctor'>
//         <span className='title'>Teaching</span>
//         <span className="plus-icon" onClick={() => setFormData(prev => ({
//           ...prev,
//           teaching: [...prev.teaching, ''],
//           topicIds: [...prev.topicIds, null]
//         }))}><FaPlus /></span>
//       </label>

//       {formData.teaching.map((topic, index) => (
//         <div key={index} className="input-with-icon">
//           <input
//             className="inputAddDoctor"
//             placeholder={index === 0 ? "Primary teaching topic (auto-saved)" : "Add teaching topic"}
//             value={topic}
//             onChange={e => {
//               const value = e.target.value;
//               setFormData(prev => {
//                 const splitTopics = value.split(',').map(t => t.trim()).filter(t => t !== '');
//                 if (splitTopics.length > 1) {
//                   const updatedTeaching = [...prev.teaching];
//                   const updatedTopicIds = [...prev.topicIds];
//                   updatedTeaching.splice(index, 1, ...splitTopics);
//                   updatedTopicIds.splice(index, 1, ...Array(splitTopics.length).fill(null));
//                   return { ...prev, teaching: updatedTeaching, topicIds: updatedTopicIds };
//                 } else {
//                   const updatedTeaching = [...prev.teaching];
//                   updatedTeaching[index] = value;
//                   const updatedTopicIds = [...prev.topicIds];
//                   updatedTopicIds[index] = null;
//                   return { ...prev, teaching: updatedTeaching, topicIds: updatedTopicIds };
//                 }
//               });
//             }}
//             onKeyDown={(e) => handleEnter(e, index, topic)}
//           />
//         </div>
//       ))}


//       {formData.teaching.filter(t => t.trim() !== '').length > 0 && (
//       <p className="teaching-topics">
//         Teaching topics: {formData.teaching.filter(t => t.trim() !== '').join(', ')}
//       </p>
//     )}

//     </div>
//   );
// };

// export default Teaching;

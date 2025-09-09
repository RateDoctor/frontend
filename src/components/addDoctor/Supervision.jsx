import { FaPlus, FaTrash } from "react-icons/fa6";

const Supervision = ({ formData, setFormData }) => {
  const handleAddSupervision = () => {
    setFormData(prev => ({
      ...prev,
      supervision: [...prev.supervision, ""]
    }));
  };

  const handleRemoveSupervision = (index) => {
    setFormData(prev => ({
      ...prev,
      supervision: prev.supervision.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <label className="top-one-line label-addDoctor">
        <span className="title">Supervision</span>
        <span className="plus-icon" onClick={handleAddSupervision}>
          <FaPlus />
        </span>
      </label>

      {formData.supervision.map((supervision, index) => (
        <div key={index} className="input-with-icon">
          <input
            className="inputAddDoctor"
            name="supervision"
            placeholder="Add supervision"
            value={supervision}
            onChange={e => {
              const updated = [...formData.supervision];
              updated[index] = e.target.value;
              setFormData({ ...formData, supervision: updated });
            }}
          />
          {supervision && (
            <button
              className="removingIcon-rating"
              type="button"
              // className="remove-btn"
              onClick={() => handleRemoveSupervision(index)}
            >
              <FaTrash />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Supervision;


// import { FaPlus } from "react-icons/fa6";

// const Supervision = ({ formData, setFormData }) => {
//   return (
//     <div>
//       <label className="top-one-line label-addDoctor">
//         <span className="title">Supervision</span>
//         <span className="plus-icon" onClick={() => setFormData(prev => ({
//           ...prev,
//           supervision: [...prev.supervision, '']
//         }))}><FaPlus /></span>
//       </label>

//       {formData.supervision.map((supervision, index) => (
//         <div key={index} className="input-with-icon">
//           <input
//             className="inputAddDoctor"
//             name="supervision"
//             placeholder="Add supervision"
//             value={supervision}
//             onChange={e => {
//               const updated = [...formData.supervision];
//               updated[index] = e.target.value;
//               setFormData({ ...formData, supervision: updated });
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Supervision;

import { useRef, useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi"; // Trash icon

const DoctorName = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");

  // Initialize preview if editing existing doctor
  useEffect(() => {
    if (formData.profileFile && typeof formData.profileFile === "string") {
      setPreviewImage(formData.profileFile);
    }
  }, [formData.profileFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, doctorName: e.target.value }));
  };

  const removeProfileImage = () => {
    setFormData((prev) => ({ ...prev, profileFile: null }));
    setPreviewImage("");
  };

  const removeDoctorName = () => {
    setFormData((prev) => ({ ...prev, doctorName: "" }));
  };

  return (
    <div className="form-left">
    {/* Doctor Name */}
      <label className="top-one-line label-addDoctor">
        Doctor Name *
      </label>
      <div className="input-with-icon">
        <input
          className="inputAddDoctor"
          name="doctorName"
          placeholder="Text"
          value={formData.doctorName || ""}
          onChange={handleNameChange}
        />
        {formData.doctorName && (
          <FiTrash2
            className="trash-icon name-trash"
            onClick={removeDoctorName}
            title="Remove name"
          />
        )}
      </div>


      {/* Profile Upload */}
      <label className="top-one-line label-addDoctor profile--name">
        Profile <span id="notRequired">(Not required)</span>
      </label>
      <div className="profile-input-wrapper">
        <input
          ref={fileInputRef}
          id="profile-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="profile-sectionCreateDoctor">
          {!previewImage && (
            <label htmlFor="profile-upload" className="custom-file-upload">
              Add photo
            </label>
          )}

          {previewImage && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
              <FiTrash2
                className="trash-icon"
                onClick={removeProfileImage}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "white",
                  borderRadius: "50%",
                  padding: "2px",
                  cursor: "pointer",
                }}
                title="Remove image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorName;


// import { useRef, useState, useEffect } from "react";

// const DoctorName = ({ formData, setFormData }) => {
//   const fileInputRef = useRef(null);
//   const [previewImage, setPreviewImage] = useState("");

//   // Initialize preview if editing existing doctor
//   useEffect(() => {
//     if (formData.profileFile && typeof formData.profileFile === "string") {
//       setPreviewImage(formData.profileFile);
//     }
//   }, [formData.profileFile]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, profileFile: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleNameChange = (e) => {
//     setFormData((prev) => ({ ...prev, doctorName: e.target.value }));
//   };

//   return (
//     <div className="form-left">
//       {/* Doctor Name */}
//       <label className="top-one-line label-addDoctor">Doctor Name *</label>
//       <input
//         className="inputAddDoctor"
//         name="doctorName"
//         placeholder="Text"
//         value={formData.doctorName || ""}
//         onChange={handleNameChange}
//       />

//       {/* Profile Upload */}
//       <label className="top-one-line label-addDoctor profile--name">
//         Profile <span id="notRequired">(Not required)*</span>
//       </label>
//       <div className="profile-input-wrapper">
//         <input
//           ref={fileInputRef}
//           id="profile-upload"
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//         <div className="profile-sectionCreateDoctor">
//           <label htmlFor="profile-upload" className="custom-file-upload">
//             Add photo
//           </label>
//           {previewImage && (
//             <img
//               src={previewImage}
//               alt="Preview"
//               style={{
//                 width: "100px",
//                 height: "100px",
//                 objectFit: "cover",
//                 borderRadius: "8px",
//                 marginTop: "10px",
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorName;

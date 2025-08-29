import { useRef, useState, useEffect } from "react";

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

  return (
    <div className="form-left">
      {/* Doctor Name */}
      <label className="top-one-line label-addDoctor">Doctor Name *</label>
      <input
        className="inputAddDoctor"
        name="doctorName"
        placeholder="Text"
        value={formData.doctorName || ""}
        onChange={handleNameChange}
      />

      {/* Profile Upload */}
      <label className="top-one-line label-addDoctor profile--name">
        Profile <span id="notRequired">(Not required)*</span>
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
          <label htmlFor="profile-upload" className="custom-file-upload">
            Add photo
          </label>
          {previewImage && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorName;




// import { useRef } from "react";


// const DoctorName = ({ formData, setFormData, navigate }) => {
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     console.log('Selected file:', e.target.files[0]);
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, doctorName: e.target.value }));
//   };

//   return (
//     <div className="form-left">
//       <label className='top-one-line label-addDoctor'>Doctor Name *</label>
//       <input
//         className="inputAddDoctor"
//         name="doctorName"
//         placeholder="Text"
//         value={formData.doctorName}
//         onChange={handleChange}
//       />

//       <label className='top-one-line label-addDoctor profile--name'>Profile  <span id="notRequired">(Not required)*</span></label>
//       <div className="profile-input-wrapper">
//         <input
//           ref={fileInputRef}
//           id="profile-upload"
//           type="file"
//           accept="image/*"
//           style={{ display: 'none' }}
//           onChange={handleFileChange}
//         />
//         <label htmlFor="profile-upload" className="custom-file-upload">
//           Add photo
//         </label>
//       </div>
//     </div>
//   );
// };

// export default DoctorName;

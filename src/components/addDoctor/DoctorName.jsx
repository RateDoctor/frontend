import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = process.env.REACT_APP_API_URL;

const DoctorName = ({ formData, setFormData, doctorId, token }) => {
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
      // فقط نخزن الملف للرفع لاحقاً
      setFormData(prev => ({ ...prev, profileFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, doctorName: e.target.value }));
  };

  // دالة لرفع الصورة عند الحفظ (مثل Dashboard)
  const uploadProfileImage = async (doctorIdToUse) => {
    if (!formData.profileFile) return null;

    try {
      const mediaForm = new FormData();
      mediaForm.append("file", formData.profileFile);
      mediaForm.append("doctorId", doctorIdToUse);
      const res = await axios.post(`${BASE_URL}/api/media/upload`, mediaForm, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      return res.data;
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
      Swal.fire("Error", "Failed to upload profile image", "error");
      return null;
    }
  };

  return (
    <div className="form-left">
      <label className="top-one-line label-addDoctor">Doctor Name *</label>
      <input
        className="inputAddDoctor"
        name="doctorName"
        placeholder="Text"
        value={formData.doctorName || ""}
        onChange={handleNameChange}
      />

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

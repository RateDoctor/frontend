import { useRef } from "react";


const DoctorName = ({ formData, setFormData, navigate }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, doctorName: e.target.value }));
  };

  return (
    <div className="form-left">
      <label className='top-one-line label-addDoctor'>Doctor Name *</label>
      <input
        className="inputAddDoctor"
        name="doctorName"
        placeholder="Text"
        value={formData.doctorName}
        onChange={handleChange}
      />

      <label className='top-one-line label-addDoctor profile--name'>Profile  <span id="notRequired">(Not required)*</span></label>
      <div className="profile-input-wrapper">
        <input
          ref={fileInputRef}
          id="profile-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="profile-upload" className="custom-file-upload">
          Add photo
        </label>
      </div>
    </div>
  );
};

export default DoctorName;

import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import './addDoctor.css';
import Navbar from "../navbar/navbar";
const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorName: '',
    affiliations: '',
    background: '',
    teaching: '',
    supervision: '',
    experience: '',
  });

  const [showCalendarFor, setShowCalendarFor] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };

  const handleSubmit = () => {
    alert('Form submitted with rating step next.');
  };

  const toggleCalendar = (field) => {
    setShowCalendarFor(showCalendarFor === field ? null : field);
  };

  const renderCalendar = (field) => {
    return (
      showCalendarFor === field && (
        <div className="calendar-popup">
          <input
            type="date"
            onChange={(e) => {
              setFormData({ ...formData, [field]: e.target.value });
              setShowCalendarFor(null);
            }}
          />
        </div>
      )
    );
  };

  return (
    <div className="form-container">
        <Navbar
        title="Explore"
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
      />
      <div className="form-left">
        <label htmlFor="doctorName" className='top-one-line label-addDoctor'>Doctor Name *</label>
        <input
          className="inputAddDoctor"
          name="doctorName"
          placeholder="Text"
          value={formData.doctorName}
          onChange={handleChange}
        />

       <label className='top-one-line label-addDoctor'>Profile *</label>
        <div className="profile-input-wrapper">
        <input
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

        <label className='top-one-line label-addDoctor'> <span className='title'>Affiliations</span> <span className="plus-icon"><FaPlus/></span></label>
        <div className="input-with-icon">
          <input
            className="inputAddDoctor"
            name="affiliations"
            placeholder="Text"
            value={formData.affiliations}
            onChange={handleChange}
          />
          <span className="calendar-icon" onClick={() => toggleCalendar('affiliations')}><RxCalendar/></span>
          {renderCalendar('affiliations')}
        </div>

        <label className='top-one-line label-addDoctor'> <span className='title'>Background</span> <span className="plus-icon"><FaPlus/></span></label>
        <input
          className="inputAddDoctor"
          name="background"
          placeholder="Text"
          value={formData.background}
          onChange={handleChange}
        />

        <label className='top-one-line label-addDoctor'><span className='title'>Teaching</span> <span className="plus-icon"><FaPlus/></span></label>
        <input
          className="inputAddDoctor"
          name="teaching"
          placeholder="Text"
          value={formData.teaching}
          onChange={handleChange}
        />

        <label className='top-one-line label-addDoctor'> <span className='title'>Supervision</span> <span className="plus-icon"><FaPlus/></span></label>
        <input
          className="inputAddDoctor"
          name="supervision"
          placeholder="Text"
          value={formData.supervision}
          onChange={handleChange}
        />

        <label class="top-one-line label-addDoctor"> <span className='title'>Experience</span></label>
        <div className="input-with-icon">
          <input
            className="inputAddDoctor"
            name="experience"
            placeholder="Text"
            value={formData.experience}
            onChange={handleChange}
          />
          <span className="calendar-icon" onClick={() => toggleCalendar('experience')}><RxCalendar/></span>
          {renderCalendar('experience')}
        </div>

        <p className="note">
          Before completing the profile creation process, we kindly ask you to provide an initial rating for Dr. {formData.doctorName || '[Doctor\'s Name]'}.
        </p>
        <div className='flex'>
        <button className="rate-button" onClick={handleSubmit}>Rate Doctor</button>
        <button className="confirm-button">Confirm</button>
        </div>
        

      </div>
       
    </div>
  );
};

export default AddDoctor;
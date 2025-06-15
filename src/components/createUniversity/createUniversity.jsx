import React, { useState, useEffect} from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import './createUniversity.css';
import Navbar from "../navbar/navbar";
import DoctorList from "../DoctorList/DoctorList.jsx";
import { supervisors } from "../explore/data.js";


const CreateUniversity = () => {


const [listViewResults, setListViewResults] = useState([]);
const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorName: '',
    affiliations: '',
    background: '',
    teaching: '',
    supervision: '',
    experience: '',
  });


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


   useEffect(() => {
    setListViewResults(supervisors);
  }, []); 

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
      <div className="form-createUniversity">
        <label htmlFor="doctorName" className='top-one-line label-addDoctor'>Official university name *</label>
        <input
          className="inputAddDoctor"
          name="doctorName"
          placeholder="Text"
          value={formData.doctorName}
          onChange={handleChange}
        />


         <label className='top-one-line label-addDoctor'> <span className='title'>Location *</span></label>
        <div className="input-with-icon">
          <input
            className="inputAddDoctor"
            name="affiliations"
            placeholder="Text"
          />
        </div>

        <div className="input-number">
          <span className='title-phone'>Phone Number</span>
          <span className="theNumber" >+1 012 3456 789</span>
        </div>

       <label className='top-one-line label-addDoctor'>Logo *</label>
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

        <div className="phd-doctor-box">
        <span className="phd-label">Phd Doctors *</span>
        <DoctorList doctors={listViewResults.slice(1,4)} onSelect={() => setIsSearchFocused(false)} />
        </div>



        <div className='flex'>
        <button className="add-doctor" onClick={handleSubmit}> <span className="plus-add-doc"><FaPlus/></span> <span className='add-doc'>Add Doctor</span> </button>
        <button className="confirm-button">Confirm</button>
        </div>
        

      </div>
       
    </div>
  );
};

export default CreateUniversity;
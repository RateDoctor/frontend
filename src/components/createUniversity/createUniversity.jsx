import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";
import DoctorList from "../DoctorList/DoctorList.jsx";
import axios from "axios";
import './createUniversity.css';
import { supervisors } from "../explore/data.js";



const CreateUniversity = () => {
const [listViewResults, setListViewResults] = useState([]);
const [isSearchFocused, setIsSearchFocused] = useState(false);
const navigate = useNavigate();

 const [formData, setFormData] = useState({
  doctorName: '',
  location: '',
  phone: '',
});

 


 const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in");
      return;
    }

    const payload = {
      name: formData.doctorName,
      location: formData.location,
      phone: formData.phone
    };

    const res = await axios.post("http://localhost:5000/api/universities", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ University created:", res.data);
    alert("University created successfully!");

    // optionally navigate or reset
    navigate("/"); // or wherever you want to go after success

  } catch (err) {
    console.error("❌ Error creating university:", err.response?.data || err.message);
    alert("Error creating university.");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };




   useEffect(() => {
    setListViewResults(supervisors);
  }, []); 

  return (
    <div className="form-container">
        <div className="settings-header">
            <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
            <h2>Create University</h2>
        </div>
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
          name="location"
          placeholder="Text"
          value={formData.location}
          onChange={handleChange}
        />
        </div>

        <div className="input-number">
          <span className='title-phone'>Phone Number</span>
            <input
              className="inputAddDoctor"
              name="phone"
              placeholder="+1 012 3456 789"
              value={formData.phone}
              onChange={handleChange} 
          />
          {/* <span className="theNumber" ></span> */}
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
        <button className="add-doctor" > <span className="plus-add-doc"><FaPlus/></span> <span className='add-doc'>Add Doctor</span> </button>
        <button className="confirm-button" onClick={handleSubmit}>Confirm</button>
        </div>
        

      </div>
       
    </div>
  );
};

export default CreateUniversity;
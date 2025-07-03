import { useState , useEffect , useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import './addDoctor.css';


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
  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);
  const [showCalendarFor, setShowCalendarFor] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const doctorId = location.state?.doctorId || searchParams.get("doctorId");
  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [isSavingField, setIsSavingField] = useState(false);
  const [isSavingTopic, setIsSavingTopic] = useState(false);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(true);


  console.log("➡️ Full location state:", location.state);
  console.log("👨‍⚕️ Received doctorId:", doctorId);



useEffect(() => {
  const handleClickOutside = (event) => {
    if (universityRef.current && !universityRef.current.contains(event.target)) {
      setIsUniversityDropdownOpen(false);
    }

    if (fieldRef.current && !fieldRef.current.contains(event.target)) {
      setIsFieldDropdownOpen(false);
    }

    if (topicRef.current && !topicRef.current.contains(event.target)) {
      setIsTopicDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

 

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [uniRes, fieldRes, topicRes] = await Promise.all([
        axios.get('http://localhost:5000/api/universities', { headers }),
        axios.get('http://localhost:5000/api/fields', { headers }),
        axios.get('http://localhost:5000/api/topics', { headers }),
      ]);

      setUniversities(uniRes.data);
      setFields(fieldRes.data);
      setTopics(topicRes.data);
    } catch (err) {
      console.error('Error fetching lists:', err);
    }
  };

  fetchData();
}, []);





  useEffect(() => {
      const role = localStorage.getItem("userRole");
      if (role !== "supervisor") {
        // Redirect students or unauthorized users
        navigate("/");
      }
    }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };


  const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};





  const handleSubmit = async () => {
  console.log("📨 Submitting doctor:", formData);

  // Validation before proceeding
  if (!formData.universityId) {
    alert("Please select or wait for university to be saved.");
    return;
  }
  if (!formData.fieldOfStudyId) {
    alert("Please select or wait for field of study to be saved.");
    return;
  }
  if (!formData.topicId && formData.teaching.trim()) {
    alert("Please select or wait for topic to be saved.");
    return;
  }


  if (isSavingField || isSavingTopic) {
  alert("Please wait, saving field/topic...");
  return;
}
  const payload = {
    name: formData.doctorName,
    universityId: formData.universityId, // Ideally selected from UI
    fieldOfStudyId: formData.fieldOfStudyId || null,
    topicId: formData.topicId || null,
    affiliations: formData.affiliations,
    background: formData.background,
    teaching: formData.teaching,
    supervision: formData.supervision,
    experience: formData.experience,
    researchInterests: [], // optional
  };

  const token = localStorage.getItem("authToken");
  console.log("Token being sent:", token);
  if (!token) {
    alert("You're not logged in");
    return;
  }

  setIsSavingField(true);
  try {
    const response = await axios.post("http://localhost:5000/api/doctors", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newDoctor = response.data?.doctor;
    console.log("🚀 New doctor created:", newDoctor);

    setIsSavingField(false);
    if (!newDoctor || !newDoctor._id) {
    alert("Error: created doctor ID missing.");
    return;
    }

    console.log("Navigating to rate-supervisor with ID:", newDoctor._id);
    navigate(`/rate-supervisor?doctorId=${newDoctor._id}`);

  } catch (err) {
    console.error("Add Doctor error:", err.response?.data || err.message);
    alert("Error creating doctor: " + (err.response?.data?.error || "Unknown error"));
  }
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
       <div className="settings-header">
            <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
            <h2>Add Doctor</h2>
        </div>
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

        <label className='top-one-line label-addDoctor'> 
          <span className='title'>Affiliations</span>
          <span
            className="plus-icon"
            onClick={() => setIsUniversityDropdownOpen(!isUniversityDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            <FaPlus />
          </span>
        </label>

       <div className="input-with-icon" ref={universityRef}>
        <input
          className="inputAddDoctor"
          name="affiliations"
          placeholder="Search or type affiliation"
          value={formData.affiliations}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, affiliations: value, universityId: null }); // clear ID when typing
          }}
        />
        <span className="calendar-icon" onClick={() => toggleCalendar('affiliations')}><RxCalendar/></span>
        {renderCalendar('affiliations')}

        {/* Show dropdown if user is typing and matches found */}
        
        {isUniversityDropdownOpen && (
        <ul className="autocomplete-dropdown">
          {universities
            .filter(uni =>
              isUniversityDropdownOpen || !formData.affiliations
                ? true
                : uni.name.toLowerCase().includes(formData.affiliations.toLowerCase())
            )
            .map(uni => (
             <li
                key={uni._id}
                onClick={() => {
                  setFormData({
                    ...formData,
                    affiliations: uni.name,
                    universityId: uni._id,
                  });
                  setIsUniversityDropdownOpen(false);
                }}
              >
                {uni.name} – 
                  {typeof uni.location === 'string'
                    ? uni.location
                    : `${uni.location?.city || ''}, ${uni.location?.country || ''}`} 
                  – {uni.phone}
              </li>
            ))}
          {universities.length === 0 && (
            <li>No universities found</li>
          )}
        </ul>
      )}
      </div>

      <label className='top-one-line label-addDoctor'>
      <span className='title'>Background</span>
      <span
        className="plus-icon"
        onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
        style={{ cursor: 'pointer' }}
      >
        <FaPlus />
      </span>
    </label>

    <div className="input-with-icon"  ref={fieldRef}>
      <input
        className="inputAddDoctor"
        name="background"
        placeholder="Search or type background"
        value={formData.background}
        onChange={(e) => {
          const value = e.target.value;
          setFormData({ ...formData, background: capitalizeFirstLetter(value), fieldOfStudyId: '' });
        }}
       onKeyDown={async (e) => {
    if (e.key === 'Enter') {
      const match = fields.find(
        f => f.name.toLowerCase() === formData.background.toLowerCase()
      );
      if (!match && formData.background.trim()) {
        try {
          const token = localStorage.getItem('authToken');
          setIsReadyToSubmit(false); 
          const response = await axios.post(
            'http://localhost:5000/api/fields',
            { name: capitalizeFirstLetter(formData.background) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const newField = response.data;
          setFields(prev => [...prev, newField]);
          setFormData({ ...formData, fieldOfStudyId: newField._id });
          setIsFieldDropdownOpen(true);
        } catch (err) {
          console.error('Error creating new field:', err.response?.data || err.message);
        }
      }
    }
  }}
/>

      {isFieldDropdownOpen && (
        <ul className="autocomplete-dropdown">
          {fields
            .filter(field =>
              isFieldDropdownOpen || !formData.background
                ? true
                : field.name.toLowerCase().includes(formData.background.toLowerCase())
            )
            .map(field => (
              <li
                key={field._id}
                onClick={() => {
                  setFormData({
                    ...formData,
                    background: field.name,
                    fieldOfStudyId: field._id,
                  });
                  setIsFieldDropdownOpen(false);
                  
                }}
              >
                {field.name}
              </li>
            ))}
          {fields.length === 0 && (
            <li>No fields found</li>
          )}
        </ul>
      )}
    </div>


       <label className='top-one-line label-addDoctor'>
        <span className='title'>Teaching</span>
        <span className="plus-icon" onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)} style={{ cursor: 'pointer' }}>
          <FaPlus />
        </span>
      </label>
    <div className="input-with-icon" ref={topicRef}>
    <input
      className="inputAddDoctor"
      name="teaching"
      placeholder="Search or type teaching topic"
      value={formData.teaching}
      onChange={(e) => {
        const value = e.target.value;
        setFormData({ ...formData, teaching: capitalizeFirstLetter(value), topicId: '' });
      }}
    onKeyDown={async (e) => {
      if (e.key === 'Enter') {
        const match = topics.find(
          t =>
            t.name.toLowerCase() === formData.teaching.toLowerCase() &&
            t.field === formData.fieldOfStudyId
        );

        if (!match && formData.teaching.trim() && formData.fieldOfStudyId) {
          try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
              "http://localhost:5000/api/topics",
              {
                name: capitalizeFirstLetter(formData.teaching),
                fieldId: formData.fieldOfStudyId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const newTopic = response.data;
            setTopics(prev => [...prev, newTopic]);
            setFormData({ ...formData, topicId: newTopic._id });
            setIsTopicDropdownOpen(false);
          } catch (err) {
            console.error("Error creating topic:", err.response?.data || err.message);
          }
        }
      }
    }}
  />

  {isTopicDropdownOpen && (
    <ul className="autocomplete-dropdown">
      {topics
        .filter(topic =>
          formData.fieldOfStudyId && topic.field === formData.fieldOfStudyId &&
          topic.name.toLowerCase().includes(formData.teaching.toLowerCase())
        )
        .map(topic => (
          <li
            key={topic._id}
            onClick={() => {
              setFormData({
                ...formData,
                teaching: topic.name,
                topicId: topic._id,
              });
              setIsTopicDropdownOpen(false);
            }}
          >
            {topic.name}
          </li>
        ))}
      {
        formData.fieldOfStudyId &&
        !topics.some(
          t =>
            t.name.toLowerCase() === formData.teaching.toLowerCase() &&
            t.field === formData.fieldOfStudyId
        ) && formData.teaching.trim() && (
          <li
            className="add-new-item"
            onClick={async () => {
              try {
                const token = localStorage.getItem("authToken");
                const response = await axios.post(
                  "http://localhost:5000/api/topics",
                  {
                    name: capitalizeFirstLetter(formData.teaching),
                    fieldId: formData.fieldOfStudyId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const newTopic = response.data;
                setTopics(prev => [...prev, newTopic]);
                setFormData({ ...formData, topicId: newTopic._id });
                setIsTopicDropdownOpen(false);
              } catch (err) {
                console.error("Error creating topic:", err.response?.data || err.message);
              }
            }}
          >
            + Add "{capitalizeFirstLetter(formData.teaching)}"
          </li>
        )
      }
    </ul>
  )}
</div>

        <label className='top-one-line label-addDoctor'> <span className='title'>Supervision</span> <span className="plus-icon"><FaPlus/></span></label>
        <input
          className="inputAddDoctor"
          name="supervision"
          placeholder="Text"
          value={formData.supervision}
          onChange={handleChange}
        />

        <label className="top-one-line label-addDoctor"> <span className='title'>Experience</span></label>
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
        <button className="rate-button"  type="button" >Rate Doctor</button>
        <button className="confirm-button"  type="button" onClick={handleSubmit}>Confirm</button>
        </div>
        

      </div>
       
    </div>
  );
};

export default AddDoctor;
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
    affiliations: [{ name: '', joined: '' }],
    backgrounds:  [''],
    teaching: [''],
    topicIds: [], 
    supervision: [''],
    experience: [''],
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBackground, setNewBackground] = useState('');
  const [isAddingBackground, setIsAddingBackground] = useState(false);

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



const ensureTopicId = async (topicName, fieldId, index) => {
  const topic = topicName.trim();
  console.log(`➡️ ensureTopicId: "${topic}" for field "${fieldId}"`);

  if (!topic || !fieldId) return null;

  const existingTopic = topics.find(
    (t) => t.name.toLowerCase() === topic.toLowerCase() && t.field === fieldId
  );

  if (existingTopic) {
    return existingTopic._id;
  }

  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      "http://localhost:5000/api/topics",
      { name: capitalizeFirstLetter(topic), fieldId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const newTopic = response.data;
    setTopics((prev) => [...prev, newTopic]);
    return newTopic._id;
  } catch (err) {
    console.error(`❌ Error creating topic "${topic}":`, err.response?.data || err.message);
    throw new Error(`Error creating topic: "${topic}". Please try again.`);
  }
};


const handleSubmit = async () => {
  console.log("📨 Submitting doctor:", formData);

  // Step 1: Validate university selection
  if (!formData.universityId) {
    alert("Please select or wait for university to be saved.");
    return;
  }

  // Step 2: Ensure fieldOfStudyId is set using first background
  const primaryBackground = formData.backgrounds[0]?.trim();
  if (!primaryBackground) {
    alert("Please enter a background and wait for it to be saved.");
    return;
  }

  if (!formData.fieldOfStudyId) {
    const existingField = fields.find(
      (f) => f.name.toLowerCase() === primaryBackground.toLowerCase()
    );

    if (existingField) {
      formData.fieldOfStudyId = existingField._id;
    } else {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost:5000/api/fields",
          { name: capitalizeFirstLetter(primaryBackground) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newField = response.data;
        setFields((prev) => [...prev, newField]);
        formData.fieldOfStudyId = newField._id;
      } catch (err) {
        console.error("❌ Error creating field on submit:", err.response?.data || err.message);
        alert("Error creating field. Please try again.");
        return;
      }
    }
  }

  // Step 3: Ensure teaching topics are all saved and topicIds are filled
let topicIds = [];
try {
  topicIds = await Promise.all(
    formData.teaching.map((topic, i) => {
      const trimmed = topic.trim();
      if (!trimmed) return null;

      if (formData.topicIds[i]) return formData.topicIds[i];
      return ensureTopicId(trimmed, formData.fieldOfStudyId, i);
    })
  );
} catch (err) {
  alert(err.message);
  return;
}

// Step 4: Validate topicIds
const unsaved = topicIds.some((id, i) => formData.teaching[i].trim() && !id);
if (unsaved) {
  alert("Please select or wait for all teaching topics to be saved.");
  return;
}

  // Step 5: Submit to backend
  setIsSubmitting(true);

  const payload = {
  name: formData.doctorName,
  universityId: formData.universityId,
  fieldOfStudyId: formData.fieldOfStudyId || null,
  affiliations: formData.affiliations,
  background: formData.backgrounds,
  teaching: formData.teaching.map(t => t.trim()),
  topicIds: topicIds,
  supervision: formData.supervision,
  experience: formData.experience,
  researchInterests: [],
  };

  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You're not logged in");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/doctors", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const newDoctor = response.data?.doctor;
    if (!newDoctor || !newDoctor._id) {
      alert("Error: created doctor ID missing.");
      return;
    }

    console.log("🚀 New doctor created:", newDoctor);
    navigate(`/rate-supervisor?doctorId=${newDoctor._id}`);
  } catch (err) {
    console.error("Add Doctor error:", err.response?.data || err.message);
    alert("Error creating doctor: " + (err.response?.data?.error || "Unknown error"));
  } finally {
    setIsSubmitting(false);
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


  {/* Affiliations section */}
  <label className='top-one-line label-addDoctor'> 
    <span className='title'>Affiliations</span>
    <span className="plus-icon" onClick={() =>
    setFormData({
      ...formData,
      affiliations: [...formData.affiliations, { name: '', joined: '' }],
        })
    }>
    <FaPlus />
  </span>
  </label>


  {formData.affiliations.map((aff, index) => (
    <div key={index} className="input-with-icon" ref={universityRef}>
      <input
        className="inputAddDoctor"
        placeholder="Search or type affiliation"
        value={aff.name}
        onChange={(e) => {
        const updated = Array.isArray(formData.affiliations) ?
        [...formData.affiliations] : [{ name: '', joined: '' }];
        updated[index].name = e.target.value;
        setFormData({ ...formData, affiliations: updated });
      }}

        onFocus={() => setIsUniversityDropdownOpen(true)}
      />

      <span className="calendar-icon" onClick={() => setShowCalendarFor(`affiliations-${index}`)}><RxCalendar /></span>
      {showCalendarFor === `affiliations-${index}` && (
        <div className="calendar-popup">
          <input
            type="date"
            value={aff.joined}
            onChange={(e) => {
              const updated = [...formData.affiliations];
              updated[index].joined = e.target.value;
              setFormData({ ...formData, affiliations: updated });
              setShowCalendarFor(null);
            }}
          />
        </div>
      )}

      {/* dropdown for selecting university */}
      {isUniversityDropdownOpen && (
        <ul className="autocomplete-dropdown">
          {universities
            .filter((uni) =>
              uni.name.toLowerCase().includes(aff.name.toLowerCase())
            )
            .map((uni) => (
              <li
                key={uni._id}
                onClick={() => {
                  const updated = [...formData.affiliations];
                  updated[index].name = uni.name;
                  setFormData({ ...formData, affiliations: updated, universityId: uni._id });
                  setIsUniversityDropdownOpen(false);
                }}
              >
                {uni.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  ))}


  {/* Background section */}
 


<label className="top-one-line label-addDoctor">
  <span className="title">Background</span>
  <span
    className="plus-icon"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        backgrounds: [...prev.backgrounds, ''], // add new empty input
      }))
    }
    style={{ cursor: 'pointer' }}
  >
    <FaPlus />
  </span>
</label>

{/* Multiple Background Inputs */}
{formData.backgrounds.map((bg, index) => (
  <div key={index} className="input-with-icon">
    <input
      className="inputAddDoctor"
      placeholder={
        index === 0
          ? "Primary field of study (auto-saved)"
          : "Add background info"
      }
      value={bg}
      onChange={(e) => {
        const updated = [...formData.backgrounds];
        updated[index] = e.target.value;
        setFormData({ ...formData, backgrounds: updated });

        // If editing the first one, clear fieldOfStudyId to force re-selection or creation
        if (index === 0) {
          setFormData((prev) => ({
            ...prev,
            fieldOfStudyId: '',
          }));
        }
      }}
      onKeyDown={async (e) => {
      if (e.key === 'Enter' && index === 0 && bg.trim()) {
        const match = fields.find(
          (f) => f.name.toLowerCase() === bg.toLowerCase()
        );

        if (!match) {
          try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
              "http://localhost:5000/api/fields",
              { name: capitalizeFirstLetter(bg) },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const newField = response.data;
            setFields((prev) => [...prev, newField]);
            setFormData((prev) => ({
              ...prev,
              fieldOfStudyId: newField._id,
            }));
          } catch (err) {
            console.error("Error creating field:", err.response?.data || err.message);
            alert("Failed to save field. Please try again.");
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            fieldOfStudyId: match._id,
          }));
        }
      }
    }}

    />
  </div>
))}







{/* Teaching section */}


<label className='top-one-line label-addDoctor'>
  <span className='title'>Teaching</span>
  <span
    className="plus-icon"
    onClick={() =>
      setFormData(prev => ({
        ...prev,
        teaching: [...prev.teaching, ''],  // add new empty teaching input
        topicIds: [...prev.topicIds, null], // keep topicIds in sync
      }))
    }
    style={{ cursor: 'pointer' }}
  >
    <FaPlus />
  </span>
</label>

{formData.teaching.map((topic, index) => (
  <div
    key={index}
    className="input-with-icon"
    ref={index === formData.teaching.length - 1 ? topicRef : null}
  >
    <input
      className="inputAddDoctor"
      placeholder={index === 0 ? "Primary teaching topic (auto-saved)" : "Add teaching topic"}
      value={topic}

      onChange={e => {
        const value = e.target.value;

        setFormData(prev => {
          const splitTopics = value
            .split(',')
            .map(t => t.trim())
            .filter(t => t !== '');

          if (splitTopics.length > 1) {
            const updatedTeaching = [...prev.teaching];
            const updatedTopicIds = [...prev.topicIds];

            // Replace current index with split values
            updatedTeaching.splice(index, 1, ...splitTopics);
            updatedTopicIds.splice(index, 1, ...Array(splitTopics.length).fill(null));

            return {
              ...prev,
              teaching: updatedTeaching,
              topicIds: updatedTopicIds,
            };
          } else {
            const updatedTeaching = [...prev.teaching];
            updatedTeaching[index] = value;

            const updatedTopicIds = [...prev.topicIds];
            updatedTopicIds[index] = null;

            return {
              ...prev,
              teaching: updatedTeaching,
              topicIds: updatedTopicIds,
            };
          }
        });
      }}

      onKeyDown={async (e) => {
        if (e.key === 'Enter' && topic.trim()) {
          const existingTopic = topics.find(
            t =>
              t.name.toLowerCase() === topic.toLowerCase() &&
              t.field === formData.fieldOfStudyId
          );

          if (!existingTopic && formData.fieldOfStudyId) {
            try {
              const token = localStorage.getItem("authToken");
              const response = await axios.post(
                "http://localhost:5000/api/topics",
                {
                  name: capitalizeFirstLetter(topic),
                  fieldId: formData.fieldOfStudyId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const newTopic = response.data;
              setTopics(prev => [...prev, newTopic]);

              const updatedTopicIds = [...formData.topicIds];
              updatedTopicIds[index] = newTopic._id;
              setFormData(prev => ({ ...prev, topicIds: updatedTopicIds }));

            } catch (err) {
              console.error("Error creating topic:", err.response?.data || err.message);
              alert("Failed to save teaching topic. Please try again.");
            }
          } else if (existingTopic) {
            const updatedTopicIds = [...formData.topicIds];
            updatedTopicIds[index] = existingTopic._id;
            setFormData(prev => ({ ...prev, topicIds: updatedTopicIds }));
          }
        }
      }}
    />
  </div>
))}
      {formData.teaching.filter(t => t.trim() !== '').length > 0 && (
      <p>
        Teaching topics: {formData.teaching
          .filter(t => t.trim() !== '')
          .map(t => t.trim()[0].toUpperCase() + t.trim().slice(1))
          .join(', ')}
      </p>
    )}

{/* Supervision section */}
          <label className="top-one-line label-addDoctor">
          <span className="title">Supervision</span>
          <span
            className="plus-icon"
            onClick={() =>
              setFormData(prev => ({
                ...prev,
                supervision: [...prev.supervision, ''],
              }))
            }
          >
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
              onChange={(e) => {
                const updatedSupervision = [...formData.supervision];
                updatedSupervision[index] = e.target.value;
                setFormData({ ...formData, supervision: updatedSupervision });
              }}
            />
          </div>
        ))}



{/* Experience section */}
        <label className="top-one-line label-addDoctor">
          <span className="title">Experience</span>
          <span className="plus-icon" onClick={() =>
            setFormData(prev => ({
              ...prev,
              experience: [...prev.experience, ''],
            }))
          }>
            <FaPlus />
          </span>
        </label>
        {formData.experience.map((exp, index) => (
          <div key={index} className="input-with-icon">
            <input
              className="inputAddDoctor"
              name="experience"
              placeholder="Add experience"
              value={exp}
              onChange={(e) => {
                const updatedExperience = [...formData.experience];
                updatedExperience[index] = e.target.value;
                setFormData({ ...formData, experience: updatedExperience });
              }}
            />
            <span
              className="calendar-icon"
              onClick={() => toggleCalendar('experience', index)}
            >
              <RxCalendar />
            </span>
            {renderCalendar('experience', index)}
          </div>
        ))}

        <p className="note">
          Before completing the profile creation process, we kindly ask you to provide an initial rating for Dr. {formData.doctorName || '[Doctor\'s Name]'}.
        </p>
        <div className='flex'>
        <button className="rate-button"  type="button" >Rate Doctor</button>
        {/* <button className="confirm-button"  type="button" onClick={handleSubmit}>Confirm</button> */}

        <button className="confirm-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Confirm"}
        </button>

        </div>
        

      </div>
       
    </div>
  );
};

export default AddDoctor;
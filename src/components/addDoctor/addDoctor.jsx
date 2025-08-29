import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import DoctorName from "./DoctorName";
import Affiliations from "./Affiliations";
import Backgrounds from "./Backgrounds";
import Teaching from "./Teaching";
import Supervision from "./Supervision";
import Experience from "./Experience";
// import StarsRating from "./StarsRating";
import { ensureEntityId } from "../../utils/ensureEntityId";
import { uploadDoctorImage } from "../../utils/mediaService.js";
import { FiArrowLeft } from "react-icons/fi";
import './addDoctor.css';

const BASE_URL = process.env.REACT_APP_API_URL;

const AddDoctorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const doctorId = location.state?.doctorId || searchParams.get("doctorId");

  const [formData, setFormData] = useState({
    doctorName: '',
    affiliations: [{ name: '', joined: '' }],
    backgrounds:  [''],
    teaching: [''],
    topicIds: [],
    supervision: [''],
    experience: [''],
  });

  const [universities, setUniversities] = useState([]);
  const [fields, setFields] = useState([]);
  const [topics, setTopics] = useState([]);
  // const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [uniRes, fieldRes, topicRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/universities`, { headers }),
          axios.get(`${BASE_URL}/api/fields`, { headers }),
          axios.get(`${BASE_URL}/api/topics`, { headers }),
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

const capitalizeFirstWord = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
  
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // ✅ 1) Validate required fields
    const doctorName = formData.doctorName.trim();
    const primaryUni = formData.affiliations[0]?.name?.trim();
    const primaryField = formData.backgrounds[0]?.trim();

    if (!doctorName) throw new Error("Doctor name is required.");
    if (!primaryUni) throw new Error("University is required.");
    if (!primaryField) throw new Error("Field of study is required.");

    


    // ✅ 2) Ensure university exists
    const universityId = await ensureEntityId(
      universities,
      setUniversities,
      "universities",
      primaryUni
    );

    // ✅ 3) Ensure field exists (linked to university)
    const fieldOfStudyId = await ensureEntityId(
      fields,
      setFields,
      "fields",
      primaryField,
      { university: universityId }
    );

    // ✅ 4) Ensure topics exist (linked to field)
    const topicIds = await Promise.all(
      formData.teaching
        .filter(t => t.trim()) // skip empty
        .map(t =>
          ensureEntityId(topics, setTopics, "topics", t.trim(), {
            fieldId: fieldOfStudyId,
          })
        )
    );

    // ✅ 5) Build clean payload
    // const payload = {
    //   name: doctorName,
    //   universityId,
    //   fieldOfStudyId,
    //   affiliations: formData.affiliations.filter(a => a.name?.trim()), // skip empties
    //   background: formData.backgrounds.filter(b => b.trim()),
    //   teaching: formData.teaching.filter(t => t.trim()),
    //   topicIds,
    //   supervision: formData.supervision.filter(s => s.trim()),
    //   experience: formData.experience.filter(e => e.trim()),
    //   researchInterests: [],
    //   initialRating: rating,
    // };

    console.log("universityId:", universityId);
    console.log("fieldOfStudyId:", fieldOfStudyId);
    console.log("topicIds:", topicIds);

    const payload = {
    name: capitalizeFirstWord(doctorName),
    universityId,
    fieldOfStudyId,
    affiliations: formData.affiliations
      .filter(a => a.name?.trim())
      .map(a => ({
        name: capitalizeFirstWord(a.name.trim()),
        joined: a.joined
      })),
    background: formData.backgrounds
      .filter(b => b.trim())
      .map(b => capitalizeFirstWord(b.trim())),
    teaching: formData.teaching
      .filter(t => t.trim())
      .map(t => capitalizeFirstWord(t.trim())),
    topicIds,
    supervision: formData.supervision
      .filter(s => s.trim())
      .map(s => capitalizeFirstWord(s.trim())),
    experience: formData.experience
      .filter(e => e.trim())
      .map(e => capitalizeFirstWord(e.trim())),
    researchInterests: [],
    // initialRating: rating,
    // stars: rating,
  };
    // ✅ 6) Send request
    const token = localStorage.getItem("authToken");
    const res = await axios.post(`${BASE_URL}/api/doctors`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const newDoctor = res.data?.doctor;
    if (!newDoctor || !newDoctor._id)
      throw new Error("Doctor creation failed.");

     if (formData.profileFile) {
      try {
        const uploadResult = await uploadDoctorImage(formData.profileFile, newDoctor._id, token);
        console.log("Image uploaded:", uploadResult);
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    navigate(`/rate-admin?doctorId=${newDoctor._id}`);
  } catch (err) {
    alert(err.message || "An error occurred while submitting.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="parent--form-container">
      <div className="settings--header">
        {navigate && <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />}
        <h2>Add Doctor</h2>
      </div>
    
      <div className="form-container">

        
        <DoctorName formData={formData} setFormData={setFormData} navigate={navigate} />
        <Affiliations formData={formData} setFormData={setFormData} universities={universities} />
        <Backgrounds formData={formData} setFormData={setFormData} fields={fields} setFields={setFields} />
        <Teaching formData={formData} setFormData={setFormData} topics={topics} setTopics={setTopics} fields={fields} />
        <Supervision formData={formData} setFormData={setFormData} />
        <Experience formData={formData} setFormData={setFormData} />
        {/* <StarsRating rating={rating} setRating={setRating} /> */}

        <div className='flex'>
          <button className="rate-button" type="button">Rate Doctor</button>
          <button className="confirm-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
        </div>

        <div className='flex'>
        <button className="rate-button" type="button">
          Rate Doctor
        </button>

        <button
          className="confirm-button"
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Confirm"}
        </button>
      </div>

      </div>
  </div>
  );
};

export default AddDoctorForm;

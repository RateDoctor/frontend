// universityProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import uni from "../../imgs/uni.png";
import SearchBar from "../searchBar/searchBar";
import axios from "axios";
import UniversityStarRating from "../starRating/UniversityStarRating";
import "./universityPage.css";
const BASE_URL = process.env.REACT_APP_API_URL;

// Utilities
const groupByFirstLetter = (doctors) => {
  return doctors.reduce((groups, doctor) => {
    const letter = doctor?.name?.[0]?.toUpperCase();
    if (!letter) return groups;
    groups[letter] = groups[letter] || [];
    groups[letter].push(doctor);
    return groups;
  }, {});
};

const getDisplayPhone = (phone) => {
  if (!phone || phone.trim() === "" || phone === "Unknown") return "N/A";
  return phone;
};

const normalizeDoctor = (doc) => ({
  ...doc,
  image: doc.profileImage?.fileUrl || doc.profileImage || "",
});

const UniversityProfile = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUniversityAndDoctors = async () => {
    try {
      const [uniRes, docRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/universities/${universityId}`),
        axios.get(`${BASE_URL}/api/universities/${universityId}/doctors`)
      ]);
      console.log("University API response:", uniRes.data);
      console.log("Doctors API response:", docRes.data);
      setUniversity(uniRes.data);
      setDoctors(docRes.data.map(normalizeDoctor));
    } catch (err) {
      console.error("Error fetching university or doctors", err);
    } finally {
      setLoading(false);
    }
  };
  fetchUniversityAndDoctors();
}, [universityId]);

useEffect(() => {
  if (university) {
    console.log("University location field:", university.location);
  }
}, [university]);


  const handleSearchChange = (e) => setQuery(e.target.value);
  const handleDoctorClick = (id) => navigate(`/my-ratings/${id}`);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(query.toLowerCase())
  );

  const groupedDoctors = groupByFirstLetter(filteredDoctors);

  if (loading) return <div>Loading...</div>;
  if (!university) return <div>University not found.</div>;

let locationDisplay = "N/A";

if (university.location) {
  if (typeof university.location === "string" && university.location.trim()) {
    locationDisplay = university.location;
  } else if (typeof university.location === "object") {
    const parts = [university.location.city, university.location.country].filter(Boolean);
    locationDisplay = parts.length ? parts.join(", ") : "N/A";
  }
}



  return (
    <div className='universityProfile-parent-box'>
      <div className="university-container">
        <div className="universityProfile-box">
          <div className="universityProfile-left">
            <img
              className='universityImgProfile'
              src={university.logo || uni}
              alt="University"
            />
          </div>
          <div className="drProfile-right">
           <div className="rating-stars">
              <UniversityStarRating
                universityId={universityId}
                token={localStorage.getItem("authToken")}
                editable={true} // allow user to rate
                onRatingSaved={(newRating) => {
                  setUniversity((prev) => ({ ...prev, rating: newRating }));
                }}
              />
              <span className='overallRating'>Overall rating</span>
            </div>
            <h2 className="admin-doctor-name">{university.name}</h2>
            <p className="university-fields">{locationDisplay}</p>
            <h5 className='phone-university'>Phone: <span>{getDisplayPhone(university.phone)}</span></h5>
            <button className="uni-rate-btn">
              <span className='rate-button-university-span'>Rate</span>
            </button>
          </div>
        </div>
        <div className="universityProfile-line"></div>
      </div>

      <div className="searching-box">
        <h5 className="searching-title">PhD Doctors</h5>
        <SearchBar
            placeholder="Search Doctors..."
            value={query}
            onChange={handleSearchChange}
            onSearch={(val) => setQuery(val)}
        />
      </div>

      <div className="grouped-gdoctor-list">
        {Object.entries(groupedDoctors).map(([letter, docs]) => (
          <div key={letter} className="doctor-group">
            <h3 className="group-letter">{letter}</h3>
            <div className="gdoctor-list">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  className="doctor--card"
                  onClick={() => handleDoctorClick(doc._id)}
                >
                  <div className="doctor-container">
                    <img className="doctor--image" src={doc.image} alt={doc.name} />
                    <p className="doctor-name">{doc.name}</p>
                  </div>
                  <div className="underline" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityProfile;




// import React, { useState,useEffect,useRef } from "react";import { useNavigate } from "react-router-dom";
// import SearchBar from "../searchBar/searchBar";
// import { admins } from "../explore/data";
// import DoctorList from "../DoctorList/DoctorList.jsx";
// import { renderStars } from "../../utils/renderStars"; 
// import imageDrAdmin from "../../imgs/university.png";
// import './universityPage.css'; 
// import { doctorData } from '../adminDrProfile/data';
// import Navbar from "../navbar/navbar";

// const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];
// // ✅ Define this at the very top of the file
// const groupDoctorsByFirstLetter = (doctors) => {
//   const grouped = {};

//   doctors.forEach((doc) => {
//     const firstLetter = doc.name[0].toUpperCase();

//     if (!grouped[firstLetter]) {
//       grouped[firstLetter] = [];
//     }

//     grouped[firstLetter].push(doc);
//   });

//   const sorted = Object.keys(grouped)
//     .sort()
//     .reduce((obj, key) => {
//       // ✅ Sort names inside each letter group
//       grouped[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
//       obj[key] = grouped[key];
//       return obj;
//     }, {});

//   return sorted;
// };

// const UniversityProfile = () => {
//      const [query, setQuery] = useState("");
//      const [listViewResults, setListViewResults] = useState([]);
//      const groupedDoctors = groupDoctorsByFirstLetter(listViewResults);


//     const [recentQueries, setRecentQueries] = useState([]);
//     const [selectedUniversity, setSelectedUniversity] = useState("");
//     const [selectedField, setSelectedField] = useState("");
//     const [selectedTopic, setSelectedTopic] = useState("");
//     const [isSearchFocused, setIsSearchFocused] = useState(false);
//     const [searchContext, setSearchContext] = useState("doctor");
//     const [viewState, setViewState] = useState("home");
//     const [isUniversityOpen, setIsUniversityOpen] = useState(false);
//     const [isFieldOpen, setIsFieldOpen] = useState(false);
//     const [isTopicOpen, setIsTopicOpen] = useState(false);


//     const universityRef = useRef(null);
//     const fieldRef = useRef(null);
//     const topicRef = useRef(null);


//       useEffect(() => {
//       setListViewResults(admins); // show all by default
//     }, []);
  
//     useOutsideClick(universityRef, () => setIsUniversityOpen(false));
//     useOutsideClick(fieldRef, () => setIsFieldOpen(false));
//     useOutsideClick(topicRef, () => setIsTopicOpen(false));
  
//     const navigate = useNavigate();
  
//    const handleSearch = (queryValue) => {
//      setQuery(queryValue);
//      const result = applyFilters(admins, queryValue, selectedUniversity, selectedField, selectedTopic);
//      setListViewResults(result);
//    };
  
//     const applyFilters = (data, queryStr, university, field, topic) => {
//       let result = data;
  
//       if (queryStr) {
//         result = result.filter(sup =>
//           sup.name.toLowerCase().includes(queryStr.toLowerCase())
//         );
//       }
//       if (university) {
//         result = result.filter(sup => sup.university === university);
//       }
//       if (field) {
//         result = result.filter(sup => sup.field === field);
//       }
//       if (topic) {
//         result = result.filter(sup => sup.topics.includes(topic));
//       }
  
//       return result;
//     };
  


  
//   function useOutsideClick(ref, callback) {
//     useEffect(() => {
//       function handleClick(event) {
//         if (ref.current && !ref.current.contains(event.target)) {
//           callback();
//         }
//       }
//       document.addEventListener("mousedown", handleClick);
//       return () => {
//         document.removeEventListener("mousedown", handleClick);
//       };
//     }, [ref, callback]);
//   }

//   if (!doctorData) {
//     return <div>Loading doctor data...</div>;
//   }

//   return (
// <div className='universityProfile-parent-box'>
//       <div className="university-container">
//            <div className="universityProfile-box">
//           <div className="universityProfile-left">
//           <img className='universityImgProfile' src={imageDrAdmin} alt="admin" />
//           </div>

//             <div className="drProfile-right">
//             <div className="rating-stars">
//               {renderStars(Number(doctorData?.rating ?? 0)) }
//               <span className='overallRating'>Overall rating</span>
//             </div>
//             <div className="name-and-bookmark">
//               <h2 className="admin-doctor-name">{doctorData.universityName}</h2>
//             </div>

//             <p className="university-fields">Paris, France</p>
//             <h5 className='phone-university'>Phone: <span>+33 1 40 46 22 11</span></h5>
//             <button className="uni-rate-btn"><span className='rate-button-university-span'>Rate</span></button>
//           </div>
//       </div>
//           <div className="universityProfile-line"></div>
//       </div>
 

//       <div className="searching-box">
//       <h5 className="searching-title">Phd Doctors</h5>
//               <SearchBar
//           placeholder="Search Doctors..."
//           onSearch={(val) => {
//             handleSearch(val);
//             setIsSearchFocused(true);
//           }}
//           onFocus={() => {
//             setIsSearchFocused(true);
//             handleSearch("");  // Empty search when focused
//           }}
//           value={query}
//         />
//       </div>
      
//         {/* Doctor List with toggled visibility */}
//       <div className="grouped-doctor-list">
//         {Object.entries(groupedDoctors).map(([letter, doctors]) => (
//           <div key={letter} className="doctor-group">
//             <h3 className="group-letter">{letter}</h3>
//             <div className="doctor-list">
//               {doctors.map((doctor, index) => (
//                 <div key={index} className="doctor--card">
//                   <div className="doctor-container">
//                     <img className="doctor--image" src={doctor.image} alt="doctorImage" />
//                     <p className="doctor-name">{doctor.name}</p>
//                   </div>
                
//                   <div className="underline" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>



// </div>
 
//   );
// };

// export default UniversityProfile;

import React, { useState,useEffect,useRef } from "react";import { useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/searchBar";
import { supervisors } from "../explore/data";
import DoctorList from "../DoctorList/DoctorList.jsx";
import { renderStars } from "../../utils/renderStars"; 
import imageDrSupervisor from "../../imgs/university.png";
import './universityPage.css'; 
import { doctorData } from '../supervisorDrProfile/data';
import Navbar from "../navbar/navbar";

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];
// ✅ Define this at the very top of the file
const groupDoctorsByFirstLetter = (doctors) => {
  const grouped = {};

  doctors.forEach((doc) => {
    const firstLetter = doc.name[0].toUpperCase();

    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }

    grouped[firstLetter].push(doc);
  });

  const sorted = Object.keys(grouped)
    .sort()
    .reduce((obj, key) => {
      // ✅ Sort names inside each letter group
      grouped[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
      obj[key] = grouped[key];
      return obj;
    }, {});

  return sorted;
};

const UniversityProfile = () => {
     const [query, setQuery] = useState("");
     const [listViewResults, setListViewResults] = useState([]);
     const groupedDoctors = groupDoctorsByFirstLetter(listViewResults);


    const [recentQueries, setRecentQueries] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedField, setSelectedField] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchContext, setSearchContext] = useState("doctor");
    const [viewState, setViewState] = useState("home");
    const [isUniversityOpen, setIsUniversityOpen] = useState(false);
    const [isFieldOpen, setIsFieldOpen] = useState(false);
    const [isTopicOpen, setIsTopicOpen] = useState(false);


    const universityRef = useRef(null);
    const fieldRef = useRef(null);
    const topicRef = useRef(null);


      useEffect(() => {
      setListViewResults(supervisors); // show all by default
    }, []);
  
    useOutsideClick(universityRef, () => setIsUniversityOpen(false));
    useOutsideClick(fieldRef, () => setIsFieldOpen(false));
    useOutsideClick(topicRef, () => setIsTopicOpen(false));
  
    const navigate = useNavigate();
  
   const handleSearch = (queryValue) => {
     setQuery(queryValue);
     const result = applyFilters(supervisors, queryValue, selectedUniversity, selectedField, selectedTopic);
     setListViewResults(result);
   };
  
    const applyFilters = (data, queryStr, university, field, topic) => {
      let result = data;
  
      if (queryStr) {
        result = result.filter(sup =>
          sup.name.toLowerCase().includes(queryStr.toLowerCase())
        );
      }
      if (university) {
        result = result.filter(sup => sup.university === university);
      }
      if (field) {
        result = result.filter(sup => sup.field === field);
      }
      if (topic) {
        result = result.filter(sup => sup.topics.includes(topic));
      }
  
      return result;
    };
  


  
  function useOutsideClick(ref, callback) {
    useEffect(() => {
      function handleClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }, [ref, callback]);
  }

  if (!doctorData) {
    return <div>Loading doctor data...</div>;
  }

  return (
<div className='universityProfile-parent-box'>
     {/* <Navbar
            title="Explore"
            onBack={() => {
             if (window.history.length > 2) {
            navigate(-1);
              } else {
            navigate("/");
          }
        }}
      /> */}
      <div className="university-container">
           <div className="universityProfile-box">
          <div className="universityProfile-left">
          <img className='universityImgProfile' src={imageDrSupervisor} alt="Supervisor" />
          </div>

            <div className="drProfile-right">
            <div className="rating-stars">
              {renderStars(Number(doctorData?.rating ?? 0)) }
              <span className='overallRating'>Overall rating</span>
            </div>
            <div className="name-and-bookmark">
              <h2 className="superVisor-doctor-name">{doctorData.universityName}</h2>
            </div>

            <p className="university-fields">Paris, France</p>
            <h5 className='phone-university'>Phone: <span>+33 1 40 46 22 11</span></h5>
            <button className="uni-rate-btn"><span className='rate-button-university-span'>Rate</span></button>
          </div>
      </div>
          <div className="universityProfile-line"></div>
      </div>
 

      <div className="searching-box">
      <h5 className="searching-title">Phd Doctors</h5>
              <SearchBar
          placeholder="Search Doctors..."
          onSearch={(val) => {
            handleSearch(val);
            setIsSearchFocused(true);
          }}
          onFocus={() => {
            setIsSearchFocused(true);
            handleSearch("");  // Empty search when focused
          }}
          value={query}
        />
      </div>
      
        {/* Doctor List with toggled visibility */}
      <div className="grouped-doctor-list">
        {Object.entries(groupedDoctors).map(([letter, doctors]) => (
          <div key={letter} className="doctor-group">
            <h3 className="group-letter">{letter}</h3>
            <div className="doctor-list">
              {doctors.map((doctor, index) => (
                <div key={index} className="doctor--card">
                  <div className="doctor-container">
                    <img className="doctor--image" src={doctor.image} alt="doctorImage" />
                    <p className="doctor-name">{doctor.name}</p>
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

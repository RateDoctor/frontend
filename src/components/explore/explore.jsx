import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorCard from "../supervisorCard/supervisorcard.jsx";
import axios from "axios"; 
import SearchBar from "../searchBar/searchBar";
import DoctorList from "../DoctorList/DoctorList.jsx";
import "../explore/explore.css";

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

const Explore = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchContext, setSearchContext] = useState("doctor");
  const [listViewResults, setListViewResults] = useState([]);
  const [viewState, setViewState] = useState("home");
  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);


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
      result = result.filter(sup => {
        if (typeof sup.university === 'object') {
          return sup.university._id === university._id;
        }
        return sup.university === university;
      });
    }
    if (field) {
      result = result.filter(sup => {
        if (typeof sup.field === 'object'){
          return sup.field._id === field._id;
        }
        return sup.field._id === field._id;
      });     
    }

    if (topic) {
      result = result.filter(sup => {
        if (typeof sup.topic === 'object'){
          return sup.topic._id === topic._id;
        }
        return sup.topic._id === topic._id;
      });
    }

    return result;
  };

  const universities = getUnique(supervisors, "university");
  const fields = getUnique(
    supervisors.filter(s => selectedUniversity ? s.university === selectedUniversity : true),
    "field"
  );
  const topics = getUnique(
    supervisors.filter(s => selectedField ? s.field === selectedField : true),
    "topics"
  ).flat();

  const filtered = applyFilters(supervisors, query, selectedUniversity, selectedField, selectedTopic);

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
 

const normalizeDoctorData = (doctor) => {
  return {
    ...doctor,
    field: doctor.fieldOfStudy || doctor.field || "No field",
    topics: doctor.topic ? [doctor.topic] : [], // ✅ FIXED: always an array
    image: doctor.profileImage?.fileUrl || doctor.profileImage || "",
    rating: doctor.avgRating || doctor.rating || 0
  };
};




const handleDoctorClick = async (doctorId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role === "supervisor") {
    navigate(`/supervisor-dr-profile/${doctorId}`);
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/ratings/users/${user._id}/ratings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });

    const existingRating = res.data.find(r => r.doctorId._id === doctorId);

    if (existingRating) {
      navigate(`/my-ratings/${existingRating.doctorId._id}`);
    } else {
      navigate(`/my-ratings/${doctorId}?new=true`);
    }
  } catch (error) {
    console.error("Error checking existing rating", error);
    navigate(`/my-ratings/${doctorId}?new=true`);
  }
};


useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}` // if your API is protected
        }
      });

       // Normalize and update supervisors
      const doctorList = response.data?.doctors.map(normalizeDoctorData) || [];
      setSupervisors(doctorList);

    } catch (error) {
      console.error("Error fetching doctors:", error.response?.data || error.message);
      setSupervisors([]); // fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);

  return (

    <div className="explore-container">
      <div className="search-wrapper" style={{ position: "relative" }}>
        <SearchBar
         placeholder="Search Doctors..."
          onSearch={(val) => {
            handleSearch(val);
            setIsSearchFocused(true);
            setViewState("filterDoctors");
          }}
            onFocus={() => {
            setIsSearchFocused(true);
            setViewState("filterDoctors"); // Show list immediately
            handleSearch("");
          }}
          value={query}
        />
      </div>

      {/* Overlay when search is focused */}
      {isSearchFocused && (
        <div className="search-overlay">

          <div className="filter-bar">

          {/* University Dropdown */}
          <div className={`custom-select ${isUniversityOpen ? "open" : ""}`} ref={universityRef}>
            <div 
            className={`select-header ${selectedUniversity ? "selected-header" : ""}`}
             onClick={() => setIsUniversityOpen(!isUniversityOpen)}>
              {selectedUniversity || "All Universities"} <span className="arrow">&#9662;</span>
            </div>
            {isUniversityOpen && (
                 <div className="dropdown-overlay" style={{ zIndex: 300 }}>
              <ul className="doctor-list custom-dropdown">
                <li
                  className={!selectedUniversity ? "lists selected" : "lists"}
                  onClick={() => {
                    setSelectedUniversity("");
                    setSelectedField("");
                    setSelectedTopic("");
                    setIsUniversityOpen(false);
                    handleSearch(query);
                  }}
                >
                  All Universities
                </li>

                console.log("universities", universities);
                console.log("selectedUniversity", selectedUniversity);

                
                {universities.map((uni) => (
                  <li
                    key={uni._id}
                    className={`lists ${selectedUniversity === uni ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedUniversity(uni);
                      setSelectedField("");
                      setSelectedTopic("");
                      setIsUniversityOpen(false);
                      handleSearch(query);
                    }}
                  >
                    {/* {uni.name} */}
                     {typeof uni === 'object' ? uni.name : uni}
                  </li>
                ))
                }

                 <div className="not-found">
                  <p className="paragraph-not-found">University not found.</p>
                 <li
                 className="hyperlink-not-found"
                  style={{ color: "#0074E4", cursor: "pointer",  }}
                  onClick={() => navigate("/create-university")}
                >
                  Create University
                </li>
                </div>
              </ul>
             </div>
            )}
          </div>

          {/* Field Dropdown */}
          {selectedUniversity && (
          <div className={`custom-select ${isFieldOpen ? "open" : ""}`} ref={fieldRef}>
              <div 
              className={`select-header ${selectedField ? "selected-header" : ""}`}
              onClick={() => setIsFieldOpen(!isFieldOpen)}>
                {selectedField || "All Fields"} <span className="arrow">&#9662;</span>
              </div>
              {isFieldOpen && (
                 <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                <ul className="doctor-list custom-dropdown">
                  <li
                    className={!selectedField ? "lists selected" : "lists"}
                    onClick={() => {
                      setSelectedField("");
                      setSelectedTopic("");
                      setIsFieldOpen(false);
                      handleSearch(query);
    
                    }}
                  >
                    All Fields
                  </li>
                  {fields.map((field, index) => (
                    <li
                      key={index}
                      
                      className={selectedField === field ? "lists selected" : "lists"}
                      onClick={() => {
                            setSelectedField(field);
                            setSelectedTopic(""); // Only clear downstream filters
                            setIsFieldOpen(false);
                            handleSearch(query);

                      }}
                    >
                     {field}
                    </li>
                  ))}
                </ul>
              </div>
              )}
            </div>
          )}

         

          {/* Topic Dropdown */}
          {selectedField && (
            <div1111 className={`custom-select ${isTopicOpen ? "open" : ""}`} ref={topicRef}>
              <div 
               className={`select-header ${selectedTopic ? "selected-header" : ""}`}
               onClick={() => setIsTopicOpen(!isTopicOpen)}>
                {selectedTopic || "All Topics"} <span className="arrow">&#9662;</span>
              </div>
              {isTopicOpen && (
                 <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                <ul className="doctor-list custom-dropdown">
                  <li
                    className={!selectedTopic ? "lists selected" : "lists"}
                    onClick={() => {
                    setSelectedTopic("");      
                    setIsTopicOpen(false);     
                    handleSearch(query);       
                    }}
                  >
                    All Topics
                  </li>
                  {topics.map((topic, index) => (
                    <li
                      key={index}
                      className={selectedTopic === topic ? "lists selected" : "lists"}
                      onClick={() => {
                          setSelectedTopic(topic);
                          setIsTopicOpen(false);
                          handleSearch(query);
                      }}
                    >
                     {topic}
                    </li>
                  ))}
                </ul>
                </div>
              )}
            </div1111>
          )}

            {!query && !selectedUniversity && !selectedField && !selectedTopic && (
            <p className="recent">Recent</p>
            )}

        </div>


          {/* Filtered search results */}
        {/* {listViewResults.length > 0 ? (

        <DoctorList 
          doctors={listViewResults}
          onDoctorClick={(doctor) => {
            setIsSearchFocused(false);
            navigate(`/rate-supervisor?doctorId=${doctor._id}`);
          }}
        /> */}

        {listViewResults.length > 0 && JSON.parse(localStorage.getItem("user"))?.role === "supervisor" ? (
        <DoctorList 
          doctors={listViewResults}
          onDoctorClick={(doctor) => {
            setIsSearchFocused(false);
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.role === "supervisor") {
              navigate(`/supervisor-dr-profile/${doctor._id}`);
            } else {
              navigate(`/my-ratings/${doctor._id}`);
            }
          }}
        />
  



        ) : (
         <p style={{ marginTop: "1rem" }}>
          Supervisor not found.
          <span
            style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/addDoctor")}
          >
            Add doctor
          </span>
        </p>

        )}
        </div>
      )}

      {!isSearchFocused && (
  <>
    <div className="header-text">
      <h2>Rate Your PhD Experience:<br />Explore and Evaluate Supervisors</h2>
      <p>Explore PhD Supervisors and share your academic experiences by rating your PhD supervisor</p>
    </div>

    <div className="scrollable-section">
      <div className="card-grid">
        {filtered.length > 0 ? (
          // filtered.map((sup, index) => (
          //   // <SupervisorCard key={index} {...sup} 
          //   // onClick={() => navigate(`/rate-supervisor?doctorId=${sup._id}`)}
          //   // />

          //   <SupervisorCard topics={sup.teaching}/>

          // ))
          filtered.map((sup, index) => (
          <SupervisorCard
            key={index}
            doctorId={sup._id}        // ✅ Add this line
            name={sup.name}
            rating={sup.rating}
            university={sup.university}
            field={sup.fieldOfStudy || sup.field}
            topics={sup.teaching}     // or sup.topics
            image={sup.image}
            onClick={() => handleDoctorClick(sup._id)}
          />


        ))
        ) : (
         <p style={{ marginTop: "1rem" }}>
          Supervisor not found.{" "}
          <span
            style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/addDoctor")}
          >
            Add doctor
          </span>
        </p>

        )}
      </div>
    </div>
  </>
)}


    
    </div>
  );};

export default Explore;
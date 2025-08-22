import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminCard from "../adminCard/adminCard.jsx";
import axios from "axios"; 
import SearchBar from "../searchBar/searchBar";
import DoctorList from "../DoctorList/DoctorList.jsx";
import Loader from "../../layouts/load/load.jsx";
import "../explore/explore.css";
const BASE_URL = process.env.REACT_APP_API_URL;

const getUnique = (arr, key) => {
  const seen = new Set();
  return arr
    .map(item => item?.[key])
    .filter(item => {
      if (!item || typeof item !== "object" || !item._id) return false;
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
};

function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

const Explore = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [matchedUniversity, setMatchedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [listViewResults, setListViewResults] = useState(admins);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
 



  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const location = useLocation();

  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);
  const overlayRef = useRef(null);

  useOutsideClick(overlayRef, () => setIsSearchFocused(false));
  useOutsideClick(universityRef, () => setIsUniversityOpen(false));
  useOutsideClick(fieldRef, () => setIsFieldOpen(false));
  useOutsideClick(topicRef, () => setIsTopicOpen(false));

  const navigate = useNavigate();

  // Apply filters to admins
  const applyFilters = (data, queryStr, university, field, topic) => {
    let result = data;

    if (queryStr) {
      const lowerQuery = queryStr.toLowerCase();
      result = result.filter(sup => sup.name.toLowerCase().includes(lowerQuery));
    }

    if (university && university._id) {
      result = result.filter(sup => {
        const uni = sup.university;
        if (!uni) return false;
        const uniId = typeof uni === "object" ? uni._id : uni;
        return String(uniId) === String(university._id);
      });
    }

    if (field && field._id) {
      result = result.filter(sup => sup.field && sup.field._id === field._id);
    }

    // if (topic && topic._id) {
    //   result = result.filter(sup => sup.topic && sup.topic._id === topic._id);
    // }
    if (topic && topic._id) {
      result = result.filter(sup => 
        Array.isArray(sup.teaching) &&
        sup.teaching.some(t => t._id === topic._id)
      );
    }


    return result;
  };


  useEffect(() => {
  fetchExploreData();
}, [location.pathname]);

useEffect(() => {
    const role = localStorage.getItem("userRole");
    
    setUserRole(role);
}, [location.pathname]);

  // Search handler
  const handleSearch = (queryValue, university = selectedUniversity, field = selectedField, topic = selectedTopic) => {
    setQuery(queryValue);

    // Else filter admins list
    const filteredResults = applyFilters(admins, queryValue, university, field, topic);
    setListViewResults(filteredResults);
  };

  // Derive filtered fields and topics from current admins and filters
  const fields = getUnique(
    admins.filter(s => !selectedUniversity || s.university?._id === selectedUniversity._id),
    "field"
  );

  // const topics = getUnique(
  //   admins.filter(s => !selectedField || s.field?._id === selectedField._id),
  //   "topic"
  // );

  const topics = Array.from(
  new Map(
    admins
      .filter(s => !selectedField || (s.field && s.field._id === selectedField._id))
      .flatMap(s => s.teaching || [])
      .filter(Boolean)
      .map(t => [t._id, t])
  ).values()
);


 
//  const fetchExploreData = async () => {
//   setLoading(true);
//   try {
//     // Fetch doctors
//     const token = localStorage.getItem("authToken");
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};

//     const doctorsRes = await axios.get(`${BASE_URL}/api/doctors`, { headers });
//     const doctorList = doctorsRes.data?.doctors.map(doc => ({
//       ...doc,
//       field: doc.fieldOfStudy || doc.field || null,
//       topic: doc.topic || null,
//       image: doc.profileImage?.fileUrl || doc.profileImage || "",
//       rating: doc.averageRating || doc.rating || 0,
//     })) || [];
//     setAdmins(doctorList);
//     setListViewResults(doctorList);

//     // Fetch universities
//     const uniRes = await axios.get(`${BASE_URL}/api/universities`);
//     setUniversities(uniRes.data || []);

//   } catch (err) {
//     setAdmins([]);
//     setListViewResults([]);
//     setUniversities([]);
//   } finally {
//     setLoading(false);
//   }
// };
 

const fetchExploreData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [doctorsRes, uniRes] = await Promise.all([
      axios.get(`${BASE_URL}/api/doctors`, { headers }),
      axios.get(`${BASE_URL}/api/universities`)
    ]);

    // const doctorList = doctorsRes.data?.doctors.map(doc => ({
    //   ...doc,
    //   field: doc.fieldOfStudy || doc.field || null,
    //   topic: doc.topic || null,
    //   image: doc.profileImage?.fileUrl || doc.profileImage || "",
    //   rating: doc.averageRating || doc.rating || 0, // include rating from API
    // })) || [];


    const doctorList = doctorsRes.data?.doctors.map(doc => ({
  ...doc,
  field: doc.fieldOfStudy || doc.field || null,
  teaching: Array.isArray(doc.teaching) 
    ? doc.teaching.map(t => typeof t === "string" ? { _id: t, name: t } : t)
    : doc.teaching 
      ? [{ _id: doc.teaching._id || doc.teaching, name: doc.teaching.name || doc.teaching }]
      : [],
  image: doc.profileImage?.fileUrl || doc.profileImage || "",
  rating: doc.averageRating || doc.rating || 0,
  // also keep topic for backward compatibility if needed
  topic: Array.isArray(doc.topic) 
    ? doc.topic.map(t => typeof t === "string" ? { _id: t, name: t } : t) 
    : doc.topic ? [{ _id: doc.topic._id || doc.topic, name: doc.topic.name || doc.topic }] : []
})) || [];


    setAdmins(doctorList);
    setListViewResults(doctorList);
    setUniversities(uniRes.data || []);
  } catch (err) {
    setAdmins([]);
    setListViewResults([]);
    setUniversities([]);
    console.error(err);
  } finally {
    setLoading(false);
  }
};

 
  useEffect(() => {
    if (isUniversityOpen || isFieldOpen || isTopicOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isUniversityOpen, isFieldOpen, isTopicOpen]);



useEffect(() => {
  if (location.pathname.includes("/explore")) {
    fetchExploreData();
  }
}, [location.pathname]);



  // Handle doctor card click
const handleDoctorClick = (doctorId) => {
 const userRole = localStorage.getItem("userRole");
   console.log("userRole is:", userRole);
    console.log("doctorId is:", doctorId);

     if (!userRole) {
    // Not logged in → redirect to login page or show message
      navigate("/login");
      return;
    }

    // if (userRole === "admin") {
    //     navigate(`/admin-dr-profile/${doctorId}`);
    // } else {
    //     navigate(`/my-ratings/${doctorId}`);
    // }
};



  return (
    <div className="explore-container">
      <div className="search-wrapper" style={{ position: "relative" }}>
        <SearchBar
          placeholder="Search Doctors..."
          onSearch={val => {
            handleSearch(val);
            setIsSearchFocused(true);
          }}
          onFocus={() => {
            setIsSearchFocused(true);
            setListViewResults(admins);
          }}
          value={query}
        />
      </div>

      {isSearchFocused && (
        <div className="search-overlay" ref={overlayRef}>
          {matchedUniversity && (
            <div
              onClick={() => {
                setIsSearchFocused(false);
                navigate(`/university-profile/${matchedUniversity._id}`);
              }}
              className="search-university-result"
            >
              {matchedUniversity.name} → Go to University Page
            </div>
          )}

          <div className="filter-row">

          {/* University Dropdown */}
          <div className={`custom-select ${isUniversityOpen ? "open" : ""}`} ref={universityRef}>
            <div
              className={`select-header ${selectedUniversity ? "selected-header" : ""}`}
              onClick={() => setIsUniversityOpen(!isUniversityOpen)}
            >
              {selectedUniversity?.name || "All Universities"} <span className="arrow">&#9662;</span>
            </div>
            {isUniversityOpen && (
              <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                <ul className="doctor-list custom-dropdown">
                  <li
                    className={!selectedUniversity ? "lists selected" : "lists"}
                    onClick={() => {
                      setSelectedUniversity(null);
                      setSelectedField(null);
                      setSelectedTopic(null);
                      setIsUniversityOpen(false);
                      handleSearch(query, null, null, null);
                    }}
                  >
                    All Universities
                  </li>
                  {universities.map(uni => (
                    <li
                      key={uni._id}
                      className={selectedUniversity?._id === uni._id ? "lists selected" : "lists"}
                      onClick={() => {
                        setSelectedUniversity(uni);
                        setSelectedField(null);
                        setSelectedTopic(null);
                        setIsUniversityOpen(false);
                        handleSearch(query, uni, null, null);
                      }}
                    >
                      {uni.name || "Unnamed"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Field Dropdown */}
          {selectedUniversity && (
            <div className={`custom-select ${isFieldOpen ? "open" : ""}`} ref={fieldRef}>
              <div
                className={`select-header ${selectedField ? "selected-header" : ""}`}
                onClick={() => setIsFieldOpen(!isFieldOpen)}
              >
                {selectedField?.name || "All Fields"} <span className="arrow">&#9662;</span>
              </div>
              {isFieldOpen && (
                <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                  <ul className="doctor-list custom-dropdown">
                    <li
                      className={!selectedField ? "lists selected" : "lists"}
                      onClick={() => {
                        setSelectedField(null);
                        setSelectedTopic(null);
                        setIsFieldOpen(false);
                        handleSearch(query, selectedUniversity, null, null);
                      }}
                    >
                      All Fields
                    </li>
                    {fields.map(field => (
                      <li
                        key={field._id}
                        className={selectedField?._id === field._id ? "lists selected" : "lists"}
                        onClick={() => {
                          setSelectedField(field);
                          setSelectedTopic(null);
                          setIsFieldOpen(false);
                          handleSearch(query, selectedUniversity, field, null);
                        }}
                      >
                        {field.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Topic Dropdown */}
          {selectedField && (
            <div className={`custom-select ${isTopicOpen ? "open" : ""}`} ref={topicRef}>
              <div
                className={`select-header ${selectedTopic ? "selected-header" : ""}`}
                onClick={() => setIsTopicOpen(!isTopicOpen)}
              >
                {selectedTopic?.name || "All Topics"} <span className="arrow">&#9662;</span>
              </div>
              {isTopicOpen && (
                <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                  <ul className="doctor-list custom-dropdown">
                    <li
                      className={!selectedTopic ? "lists selected" : "lists"}
                      onClick={() => {
                        setSelectedTopic(null);
                        setIsTopicOpen(false);
                        handleSearch(query, selectedUniversity, selectedField, null);
                      }}
                    >
                      All Topics
                    </li>
                    {topics.map(topic => (
                      <li
                        key={topic._id}
                        className={selectedTopic?._id === topic._id ? "lists selected" : "lists"}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setIsTopicOpen(false);
                          handleSearch(query, selectedUniversity, selectedField, topic);
                        }}
                      >
                        {topic.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          </div>

          {/* Doctor List Results */}
       <div className="doctor-results">
          {listViewResults.length > 0 ? (
            <DoctorList
              doctors={listViewResults}
              onDoctorClick={(doctor) => {
                setIsSearchFocused(false);
                handleDoctorClick(doctor._id);
              }}
              showRank={false}
            />
          ) : (
            <p style={{ marginTop: "1rem" }}>
              Admin not found.{" "}
              <span
                style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
                // onClick={() => navigate("/addDoctor")}
                 onClick={() => {
                  if (!localStorage.getItem("authToken")) {
                    // Guest → force login
                    navigate("/login");
                  } else {
                    navigate("/addDoctor");
                  }
                }}
              >
                Add doctor
              </span>
            </p>
          )}
          </div>
        </div>
      )}

      {/* Explore Cards when search is not focused */}
      {!isSearchFocused && (
        <>
          <div className="header-text">
            <h2>Rate Your PhD Experience:<br />Explore and Evaluate Admins</h2>
            <p>Explore PhD Admins and share your academic experiences by rating your PhD admin</p>
          </div>

         <div className="scrollable-section">
          {loading ? (
            <Loader type={1} />  // type prop can be customized if you want multiple styles
          ) : (
            <div className="card-grid">
              {applyFilters(admins, query, selectedUniversity, selectedField, selectedTopic).length > 0 ? (
                applyFilters(admins, query, selectedUniversity, selectedField, selectedTopic).map((sup, index) => (
                  <AdminCard
                    key={sup._id || index}
                    doctorId={sup._id}
                    name={sup.name}
                    rating={sup.rating}
                    university={sup.university}
                    field={sup.fieldOfStudy || sup.field}
                    topics={sup.teaching}
                    image={sup.image}
                    onClick={() => handleDoctorClick(sup._id)}
                  />
                ))
              ) : (
                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                  Admin not found.{" "}
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
        </div>


        </>
      )}
    </div>
  );
};

export default Explore;

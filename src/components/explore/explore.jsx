import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorCard from "../supervisorCard/supervisorcard.jsx";
import axios from "axios"; 
import SearchBar from "../searchBar/searchBar";
import DoctorList from "../DoctorList/DoctorList.jsx";
import "../explore/explore.css";

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
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [matchedUniversity, setMatchedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);

  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);
  const overlayRef = useRef(null);

  useOutsideClick(overlayRef, () => setIsSearchFocused(false));
  useOutsideClick(universityRef, () => setIsUniversityOpen(false));
  useOutsideClick(fieldRef, () => setIsFieldOpen(false));
  useOutsideClick(topicRef, () => setIsTopicOpen(false));

  const navigate = useNavigate();

  // Apply filters to supervisors
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

    if (topic && topic._id) {
      result = result.filter(sup => sup.topic && sup.topic._id === topic._id);
    }

    return result;
  };

  // Search handler
  const handleSearch = (queryValue, university = selectedUniversity, field = selectedField, topic = selectedTopic) => {
    setQuery(queryValue);

    // Try to find exact university match to navigate
    // const foundUniversity = universities.find(
    //   uni => uni.name.toLowerCase() === queryValue.trim().toLowerCase()
    // );
    // setMatchedUniversity(foundUniversity);

    // if (foundUniversity) {
    //   navigate(`/university/${foundUniversity._id}`);
    //   setIsSearchFocused(false);
    //   return;
    // }

    // Else filter supervisors list
    const filteredResults = applyFilters(supervisors, queryValue, university, field, topic);
    setListViewResults(filteredResults);
  };

  // Derive filtered fields and topics from current supervisors and filters
  const fields = getUnique(
    supervisors.filter(s => !selectedUniversity || s.university?._id === selectedUniversity._id),
    "field"
  );

  const topics = getUnique(
    supervisors.filter(s => !selectedField || s.field?._id === selectedField._id),
    "topic"
  );

  const [listViewResults, setListViewResults] = useState(supervisors);

  // Fetch supervisors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        const doctorList = res.data?.doctors.map(doc => ({
          ...doc,
          field: doc.fieldOfStudy || doc.field || null,
          topic: doc.topic || null,
          image: doc.profileImage?.fileUrl || doc.profileImage || "",
          rating: doc.averageRating || doc.rating || 0,

        })) || [];
        setSupervisors(doctorList);
        setListViewResults(doctorList);
      } catch (err) {
        setSupervisors([]);
        setListViewResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/universities");
        setUniversities(res.data || []);
      } catch (err) {
        setUniversities([]);
      }
    };
    fetchUniversities();
  }, []);

  // Scroll lock when dropdown open
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

  // Handle doctor card click
  const handleDoctorClick = async (doctorId) => {
    // Your existing logic for routing on doctor click
  };

  return (
    <div className="explore-container">
      <div className="search-wrapper" style={{ position: "relative" }}>
        <SearchBar
          placeholder="Search Doctors or Universities..."
          onSearch={val => {
            handleSearch(val);
            setIsSearchFocused(true);
          }}
          onFocus={() => {
            setIsSearchFocused(true);
            setListViewResults(supervisors);
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

          {/* Doctor List Results */}
          {listViewResults.length > 0 ? (
            <DoctorList
              doctors={listViewResults}
              onDoctorClick={(doctor) => {
                setIsSearchFocused(false);
                handleDoctorClick(doctor._id);
              }}
            />
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
      )}

      {/* Explore Cards when search is not focused */}
      {!isSearchFocused && (
        <>
          <div className="header-text">
            <h2>Rate Your PhD Experience:<br />Explore and Evaluate Supervisors</h2>
            <p>Explore PhD Supervisors and share your academic experiences by rating your PhD supervisor</p>
          </div>

          <div className="scrollable-section">
            <div className="card-grid">
              {applyFilters(supervisors, query, selectedUniversity, selectedField, selectedTopic).length > 0 ? (
                applyFilters(supervisors, query, selectedUniversity, selectedField, selectedTopic).map((sup, index) => (
                  <SupervisorCard
                    key={index}
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
  );
};

export default Explore;

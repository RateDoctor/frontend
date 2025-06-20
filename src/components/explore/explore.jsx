import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorCard from "../supervisorCard/supervisorcard.jsx";
import "../explore/explore.css";
import { supervisors } from "./data.js";
import SearchBar from "../searchBar/searchBar";
import Navbar from "../navbar/navbar";
import DoctorList from "../DoctorList/DoctorList.jsx";

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

const Explore = () => {
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
 
  return (

    <div className="explore-container">


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
                
                {universities.map((uni, index) => (
                  <li
                    key={index}
                    className={`lists ${selectedUniversity === uni ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedUniversity(uni);
                      setSelectedField("");
                      setSelectedTopic("");
                      setIsUniversityOpen(false);
                      handleSearch(query);
                    }}
                  >
                    {uni}
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
        {listViewResults.length > 0 ? (

        <DoctorList doctors={listViewResults} onSelect={() => setIsSearchFocused(false)} />


        ) : (
         <p style={{ marginTop: "1rem" }}>
          Supervisor not found.
          <span
            style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/add-doctor")}
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
          filtered.map((sup, index) => (
            <SupervisorCard key={index} {...sup} />
          ))
        ) : (
         <p style={{ marginTop: "1rem" }}>
          Supervisor not found.{" "}
          <span
            style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/add-doctor")}
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
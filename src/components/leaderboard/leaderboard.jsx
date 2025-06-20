import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DoctorList from "../DoctorList/DoctorList.jsx";
import { supervisors } from "../explore/data.js";
import "./leaderboard.css";
import { FiArrowLeft } from "react-icons/fi";

// Utility: Get unique values from an array of objects by key
const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

// Hook: Detect clicks outside of a referenced element
function useOutsideClick(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
}

const LeaderBoard = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [listViewResults, setListViewResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(true);

  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);

  useOutsideClick(universityRef, () => setIsUniversityOpen(false));
  useOutsideClick(fieldRef, () => setIsFieldOpen(false));
  useOutsideClick(topicRef, () => setIsTopicOpen(false));

    useEffect(() => {
        setListViewResults(supervisors); 
      }, []);
    

  const handleSearch = (val) => {
    setQuery(val);
    const result = applyFilters(supervisors, val, selectedUniversity, selectedField, selectedTopic);
    setListViewResults(result);
  };

  const applyFilters = (data, queryStr, university, field, topic) => {
    let result = data;
    if (queryStr) {
      result = result.filter(sup => sup.name.toLowerCase().includes(queryStr.toLowerCase()));
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

  const renderNoDoctorFound = () => (
    <p style={{ marginTop: "1rem" }}>
      Supervisor not found.{" "}
      <span
        style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
        onClick={() => navigate("/add-doctor")}
      >
        Add doctor
      </span>
    </p>
  );

  return (
    isSearchFocused && (
      <div className="search-overlay">

       <div className="settings-header">
            <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
            <h2>Leaderboard</h2>
       </div>

      <div className="container-leaderboard">
  <div className="filter-bar">
          {/* University Dropdown */}
          <div className={`custom-select ${isUniversityOpen ? "open" : ""}`} ref={universityRef}>
            <div
              className={`select-header ${selectedUniversity ? "selected-header" : ""}`}
              onClick={() => setIsUniversityOpen(!isUniversityOpen)}
            >
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
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Field Dropdown */}
         
            <div className={`custom-select ${isFieldOpen ? "open" : ""}`} ref={fieldRef}>
              <div
                className={`select-header ${selectedField ? "selected-header" : ""}`}
                onClick={() => setIsFieldOpen(!isFieldOpen)}
              >
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
                          setSelectedTopic("");
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

          {/* Topic Dropdown */}
            <div className={`custom-select ${isTopicOpen ? "open" : ""}`} ref={topicRef}>
              <div
                className={`select-header ${selectedTopic ? "selected-header" : ""}`}
                onClick={() => setIsTopicOpen(!isTopicOpen)}
              >
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
            </div>

        </div>

         {/* Doctor List */}
        {listViewResults.length > 0 ? (
        <DoctorList
            doctors={listViewResults.map((doc, index) => ({
                ...doc,
                rank: index + 1 // Inject rank without touching name
            }))}
            onSelect={() => setIsSearchFocused(false)}
            />
        ) : (
          renderNoDoctorFound()
        )}
      </div>
      

       
      </div>
    )
  );
};

export default LeaderBoard;

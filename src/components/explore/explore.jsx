import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorCard from "../supervisorCard/supervisorcard.jsx";
import { FiSearch, FiUsers, FiInfo } from "react-icons/fi";
import "../explore/explore.css";
import { supervisors } from "./data.js";
import SearchBar from "../searchBar/searchBar";
import Navbar from "../navbar/navbar";

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


 
  return (

    <div className="explore-container">


      <Navbar
        title="Explore"
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
      />


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
          {/* Filters */}
          <div className="filter-bar">
            <select
              value={selectedUniversity}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedUniversity(e.target.value);
                setSelectedField("");
                setSelectedTopic("");
                handleSearch(query);
              }}
            >
              <option value="">All Universities</option>
              {universities.map((uni, index) => (
                <option key={index} value={uni}>{uni}</option>
              ))}
            </select>
            <p className="recent">Recent</p>

            {selectedUniversity && (
              <select
                value={selectedField}
                onChange={(e) => {
                  setSelectedField(e.target.value);
                  setSelectedTopic("");
                  handleSearch(query);
                }}
              >
                <option value="">All Fields</option>
                {fields.map((field, index) => (
                  <option key={index} value={field}>{field}</option>
                ))}
              </select>
            )}

            {selectedField && (
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  handleSearch(query);
                }}
              >
                <option value="">All Topics</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            )}
          </div>

          {/* Filtered search results */}
          {listViewResults.length > 0 ? (
         <ul className="doctor-list">
            {listViewResults.map((doc, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(`/doctor/${doc.name}`);
                  setIsSearchFocused(false); // close overlay
                }}
                className="lists"
              >
                <img
                  src={doc.image}
                  alt={doc.name}
                 className="doctor-list-img"
                />
                {doc.name}
              </li>
            ))}
          </ul>

        ) : (
          <p style={{ marginTop: "1rem" }}>No matching supervisors found.</p>
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
          <p>No supervisor found.</p>
        )}
      </div>
    </div>
  </>
)}


      {/* Footer Navigation */}
      <footer className="footer">
        <FiSearch className="icon" />
        <FiUsers className="icon" />
        <FiInfo className="icon" />
      </footer>
    </div>
  );};

export default Explore;
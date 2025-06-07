import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupervisorCard from "../supervisorCard/supervisorcard.jsx";
import { FiArrowLeft, FiSearch, FiMoreVertical, FiUsers, FiInfo } from "react-icons/fi";
import "../explore/explore.css";
import doctorImg from "../../imgs/rateLogo.png";
import SearchBar from "../searchBar/searchBar";
import Navbar from "../navbar/navbar";

const supervisors = [
  {
    name: "Mr. Olivia Windler",
    rating: 4.5,
    university: "University of Paris",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Wassim Konopelski",
    rating: 3.0,
    university: "Universite Grenoble Alpes",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
  {
    name: "Ahmed Windler",
    rating: 4.5,
    university: "Paul Sabatier University",
    field: "Physics",
    topics: ["Quantum Mechanics", "Astrophysics"],
    image: doctorImg,
  },
  // Add more if needed
];

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
  const [showListView, setShowListView] = useState(false);

  const navigate = useNavigate();

  // const handleSearch = (value) => {
  //   setQuery(value);
  //   if (value && !recentQueries.includes(value)) {
  //     setRecentQueries(prev => [value, ...prev.slice(0, 4)]);
  //   }
  // };
  
  
// const handleSearch = (queryValue) => {
//   setQuery(queryValue);

//   // Apply filtering logic
//   let result = supervisors.filter((sup) =>
//     sup.name.toLowerCase().includes(queryValue.toLowerCase())
//   );

//   if (selectedUniversity) {
//     result = result.filter((sup) => sup.university === selectedUniversity);
//   }
//   if (selectedField) {
//     result = result.filter((sup) => sup.field === selectedField);
//   }
//   if (selectedTopic) {
//     result = result.filter((sup) => sup.topics.includes(selectedTopic));
//   }

//   // ✅ Show list only if there's a query
//   setListViewResults(queryValue.trim() ? result : []);
// };

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


  // Filter pipeline
  let filtered = supervisors.filter(sup =>
    sup.name.toLowerCase().includes(query.toLowerCase())
  );

  if (selectedUniversity) {
    filtered = filtered.filter(sup => sup.university === selectedUniversity);
  }

  if (selectedField) {
    filtered = filtered.filter(sup => sup.field === selectedField);
  }

  if (selectedTopic) {
    filtered = filtered.filter(sup => sup.topics.includes(selectedTopic));
  }

  const universities = getUnique(supervisors, "university");
  const fields = getUnique(
    supervisors.filter(s => selectedUniversity ? s.university === selectedUniversity : true),
    "field"
  );
  const topics = getUnique(
    supervisors.filter(s => selectedField ? s.field === selectedField : true),
    "topics"
  ).flat();

  return (
    <div className="explore-container">
      <Navbar title="Explore" onBack={() => console.log("Go Back")} />

      <div style={{ position: "relative" }}>
        <SearchBar
          placeholder={
            searchContext === "university"
              ? "Search Universities..."
              : searchContext === "field"
              ? "Search Fields of Study..."
              : searchContext === "topic"
              ? "Search Topics..."
              : "Search Doctors..."
          }
          onSearch={handleSearch}
        />
        {isSearchFocused && recentQueries.length > 0 && (
          <ul className="recent-searches-dropdown">
            {recentQueries.map((item, index) => (
              <li key={index} onClick={() => setQuery(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-bar">
        <select
          className="filter-dropDown"
          value={selectedUniversity}
         onChange={(e) => {
          const value = e.target.value;
          setSelectedUniversity(value);
          setSelectedField("");
          setSelectedTopic("");
          setQuery("");

          const result = applyFilters(supervisors, "", value, "", "");
          setListViewResults(result);
          setShowListView(true); // 👈
        }}

        >
          <option value="">All Universities</option>
          {universities.map((uni, index) => (
            <option key={index} value={uni}>{uni}</option>
          ))}
        </select>

        {selectedUniversity && (
          <select value={selectedField} onChange={(e) => {
            setSelectedField(e.target.value);
            setSelectedTopic("");
          }}>
            <option value="">All Fields</option>
            {fields.map((field, index) => (
              <option key={index} value={field}>{field}</option>
            ))}
          </select>
        )}

        {selectedField && (
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="">All Topics</option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>{topic}</option>
            ))}
          </select>
        )}
      </div>

      <div className="header-text">
        <h2>Rate Your PhD Experience:<br />Explore and Evaluate Supervisors</h2>
        <p>Explore PhD Supervisors and share your academic experiences by rating your PhD supervisor</p>
      </div>

      {/* <div className="scrollable-section">
        <div className="card-grid">
          {filtered.length > 0 ? (
            filtered.map((sup, index) => (
              <SupervisorCard key={index} {...sup} />
            ))
          ) : (
            <p>No supervisor found.</p>
          )}
        </div>
      </div> */}

      <div className="scrollable-section">
      {(query.trim() || selectedUniversity || selectedField || selectedTopic) ? (
        listViewResults.length > 0 ? (
          <ul style={{ background: "#fff", padding: "1rem", borderRadius: "8px" }}>
            {listViewResults.map((sup, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 0",
                  borderBottom: "1px solid #6C757D",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/doctor/${sup.name}`)} // Optional: make clickable
              >
                {sup.name}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ padding: "1rem" }}>No matching supervisors found.</p>
        )
      ) : (
        <div className="card-grid">
          {filtered.length > 0 ? (
            filtered.map((sup, index) => (
              <SupervisorCard key={index} {...sup} />
            ))
          ) : (
            <p>No supervisor found.</p>
          )}
        </div>
      )}
    </div>




      <footer className="footer">
        <FiSearch className="icon" />
        <FiUsers className="icon" />
        <FiInfo className="icon" />
      </footer>
    </div>
  );
};

export default Explore;

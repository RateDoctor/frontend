import React, { useState } from "react";
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
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Wassim Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },

  {
    name: "Wassim Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },

  {
    name: "Wassim Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },

  {
    name: "Wassim Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Ahmed Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Jalal Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Sara Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Karine Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
   {
    name: "Riad Windler",
    rating: 4.5,
    university: "University XYZ",
    field: "Chemistry",
    topics: ["Organic Chemistry", "Materials Science"],
    image: doctorImg,
  },
  {
    name: "Hadi Konopelski",
    rating: 3.0,
    university: "University XYZ",
    field: "Computer Science",
    topics: ["AI", "Machine Learning"],
    image: doctorImg,
  },
];

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

const Explore = () => {
  const [query, setQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchContext, setSearchContext] = useState("doctor");

  
  let filtered = supervisors.filter((sup) =>
    sup.name.toLowerCase().includes(query.toLowerCase())
  );

  if (selectedUniversity) {
    filtered = filtered.filter((sup) => sup.university === selectedUniversity);
  }
  if (selectedField) {
    filtered = filtered.filter((sup) => sup.field === selectedField);
  }
  if (selectedTopic) {
    filtered = filtered.filter((sup) => sup.topics.includes(selectedTopic));
  }

  const universities = getUnique(supervisors, "university");
  const fields = getUnique(supervisors.filter(s => s.university === selectedUniversity || !selectedUniversity), "field");
  const topics = getUnique(supervisors.filter(s => s.field === selectedField || !selectedField), "topics").flat();

  return (
    <div className="explore-container">
      <Navbar title="Explore" onBack={() => console.log("Go Back")} />

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
        onSearch={setQuery}
      />
      <div className="filter-bar">
        <select
            value={selectedUniversity}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedUniversity(value);
              setSelectedField("");
              setSelectedTopic("");
              setQuery("");
              setSearchContext(value ? "doctor" : "university"); // ← CHANGE
            }}
          >
          <option value="">All Universities ↓</option>
          {universities.map((uni, index) => (
            <option key={index} value={uni}>{uni}</option>
          ))}
        </select>

        {selectedUniversity && (
          <select value={selectedField} onChange={(e) => { setSelectedField(e.target.value); setSelectedTopic(""); }}>
            <option value="">All Fields ↓</option>
            {fields.map((field, index) => (
              <option key={index} value={field}>{field}</option>
            ))}
          </select>
        )}

        {selectedField && (
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="">All Topics ↓</option>
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

      <footer className="footer">
        <FiSearch className="icon" />
        <FiUsers className="icon" />
        <FiInfo className="icon" />
      </footer>
    </div>
  );
};

export default Explore;

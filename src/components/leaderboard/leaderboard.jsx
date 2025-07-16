import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DoctorList from "../DoctorList/DoctorList.jsx";
import SearchBar from "../searchBar/searchBar";
import axios from "axios";
import "./leaderboard.css";
import { FiArrowLeft } from "react-icons/fi";

const BASE_URL = process.env.REACT_APP_API_URL;

// Utility to get unique items by _id key from array of objects
const getUnique = (arr, key) => {
  const seen = new Set();
  return arr
    .map(item => item?.[key])
    .filter(item => {
      if (!item) {
        console.log("Skipped undefined/null item");
        return false;
      }
      const id = (typeof item === "object" && item._id) ? item._id : item;
      if (seen.has(id)) {
        console.log("Duplicate id skipped:", id);
        return false;
      }
      seen.add(id);
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

const LeaderBoard = () => {
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [listViewResults, setListViewResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(true);

  // Dropdown open states
  const [isUniversityOpen, setIsUniversityOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  // Refs for outside click
  const universityRef = useRef(null);
  const fieldRef = useRef(null);
  const topicRef = useRef(null);
  const overlayRef = useRef(null);

  useOutsideClick(overlayRef, () => setIsSearchFocused(false));
  useOutsideClick(universityRef, () => setIsUniversityOpen(false));
  useOutsideClick(fieldRef, () => setIsFieldOpen(false));
  useOutsideClick(topicRef, () => setIsTopicOpen(false));



  const handleSaveDoctor = (doctor) => {
  const saved = JSON.parse(localStorage.getItem("savedDoctors")) || [];
  const alreadySaved = saved.some((doc) => doc.id === doctor.id);
  if (!alreadySaved) {
    const updated = [...saved, doctor];
    localStorage.setItem("savedDoctors", JSON.stringify(updated));
    alert("Doctor saved successfully!");
  } else {
    alert("Already saved.");
  }
};

  // Fetch supervisors and universities on mount
  useEffect(() => {
    fetchLeaderBoardData();
  }, []);

  const fetchLeaderBoardData = async () => {
    setLoading(true);
    try {
      // Fetch doctors (supervisors)
      const res = await axios.get(`${BASE_URL}/api/doctors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      // Normalize fields and topics like in Explore
      const doctorList = res.data?.doctors.map(doc => ({
        ...doc,
        field: doc.fieldOfStudy || doc.field || null,
        topic: doc.topic || null,
        topics: doc.topics || (doc.topic ? [doc.topic] : []), // make sure topics array exists
        image: doc.profileImage?.fileUrl || doc.profileImage || "",
        rating: doc.averageRating || doc.rating || 0,
      })) || [];

      setSupervisors(doctorList);
      setListViewResults(doctorList);

      // Fetch universities
      const uniRes = await axios.get(`${BASE_URL}/api/universities`);
      setUniversities(uniRes.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setSupervisors([]);
      setListViewResults([]);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter application - like Explore component
  const applyFilters = (data, queryStr, university, field, topic) => {
    let result = data;

    if (queryStr) {
      const lowerQuery = queryStr.toLowerCase();
      result = result.filter(sup => sup.name.toLowerCase().includes(lowerQuery));
    }

    if (university && university._id) {
      result = result.filter(sup => {
        if (!sup.university) return false;
        const uniId = typeof sup.university === "object" ? sup.university._id : sup.university;
        return String(uniId) === String(university._id);
      });
    }

    if (field && field._id) {
      result = result.filter(sup => sup.field && sup.field._id === field._id);
    }

    if (topic && topic._id) {
      // topic or topics array
      result = result.filter(sup => {
        if (sup.topic && sup.topic._id === topic._id) return true;
        if (Array.isArray(sup.topics)) {
          return sup.topics.some(t => t._id === topic._id);
        }
        return false;
      });
    }

    return result;
  };

  // Handle search input change + filtering
  const handleSearch = (val, university = selectedUniversity, field = selectedField, topic = selectedTopic) => {
    setQuery(val);

    const filteredResults = applyFilters(supervisors, val, university, field, topic);
    setListViewResults(filteredResults);
  };

  // Get filtered fields & topics based on current selection to populate dropdowns
  const fields = getUnique(
    supervisors.filter(s => !selectedUniversity || (s.university?._id === selectedUniversity._id)),
    "field"
  );

  const topics = getUnique(
    supervisors.filter(s => !selectedField || (s.field?._id === selectedField._id)),
    "topic"
  );

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

  // Handle doctor card click
  const handleDoctorClick = doctorId => {
    setIsSearchFocused(false);
    navigate(`/doctor/${doctorId}`);
  };


  

  return (
    <div className="search-overlay">
      <div className="settings-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
        <h2>Leaderboard</h2>
      </div>

      <div className="container-leaderboard">
        <div className="search-wrapper" style={{ marginBottom: "1rem" }}>
          <SearchBar
            placeholder="Search supervisors..."
            value={query}
            onSearch={(val) => {
              handleSearch(val);
              setIsSearchFocused(true);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              setListViewResults(supervisors);
            }}
          />
        </div>

        <div className="filter-bar">
          {/* University Dropdown */}
          <div className={`customLeader-select ${isUniversityOpen ? "open" : ""}`} ref={universityRef}>
            <div
              className={`select-header ${selectedUniversity ? "selected-header" : ""}`}
              onClick={() => setIsUniversityOpen(!isUniversityOpen)}
            >
              {selectedUniversity?.name || "All Universities"} <span className="arrow">&#9662;</span>
            </div>
            {isUniversityOpen && (
              <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                <ul className="doctorLeaderboard-list custom-dropdown">
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
            <div className={`customLeader-select ${isFieldOpen ? "open" : ""}`} ref={fieldRef}>
              <div
                className={`select-header ${selectedField ? "selected-header" : ""}`}
                onClick={() => setIsFieldOpen(!isFieldOpen)}
              >
                {selectedField?.name || "All Fields"} <span className="arrow">&#9662;</span>
              </div>
              {isFieldOpen && (
                <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                  <ul className="doctorLeaderboard-list custom-dropdown">
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
            <div className={`customLeader-select ${isTopicOpen ? "open" : ""}`} ref={topicRef}>
              <div
                className={`select-header ${selectedTopic ? "selected-header" : ""}`}
                onClick={() => setIsTopicOpen(!isTopicOpen)}
              >
                {selectedTopic?.name || "All Topics"} <span className="arrow">&#9662;</span>
              </div>
              {isTopicOpen && (
                <div className="dropdown-overlay" style={{ zIndex: 300 }}>
                  <ul className="doctorLeaderboard-list custom-dropdown">
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

        {/* Doctor List */}
          {loading ? (
          <p>Loading supervisors...</p>
        ) : listViewResults.length > 0 ? (
          
          <DoctorList
              doctors={listViewResults.map((doc, index) => ({
                ...doc,
                rank: index + 1,
              }))}
              onSelect={(doctor) => {
                if (!doctor || !doctor._id) {
                  console.warn("Doctor is undefined or missing _id:", doctor);
                  return;
                }
                setIsSearchFocused(false);
                handleDoctorClick(doctor._id);
              }}

               onSaveDoctor={(doctor) =>
                handleSaveDoctor({
                  id: doctor._id,
                  name: doctor.name,
                  image: doctor.image || "",
                })
              }
              showRank={true}   
            />
            

        ) : (
          renderNoDoctorFound()
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;





// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import DoctorList from "../DoctorList/DoctorList.jsx";
// import { supervisors } from "../explore/data.js";
// import "./leaderboard.css";
// import { FiArrowLeft } from "react-icons/fi";

// // Utility: Get unique values from an array of objects by key
// const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

// // Hook: Detect clicks outside of a referenced element
// function useOutsideClick(ref, callback) {
//   useEffect(() => {
//     const handleClick = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         callback();
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => {
//       document.removeEventListener("mousedown", handleClick);
//     };
//   }, [ref, callback]);
// }

// const LeaderBoard = () => {
//   const navigate = useNavigate();

//   const [query, setQuery] = useState("");
//   const [selectedUniversity, setSelectedUniversity] = useState("");
//   const [selectedField, setSelectedField] = useState("");
//   const [selectedTopic, setSelectedTopic] = useState("");
//   const [isUniversityOpen, setIsUniversityOpen] = useState(false);
//   const [isFieldOpen, setIsFieldOpen] = useState(false);
//   const [isTopicOpen, setIsTopicOpen] = useState(false);
//   const [listViewResults, setListViewResults] = useState([]);
//   const [isSearchFocused, setIsSearchFocused] = useState(true);

//   const universityRef = useRef(null);
//   const fieldRef = useRef(null);
//   const topicRef = useRef(null);

//   useOutsideClick(universityRef, () => setIsUniversityOpen(false));
//   useOutsideClick(fieldRef, () => setIsFieldOpen(false));
//   useOutsideClick(topicRef, () => setIsTopicOpen(false));

//     useEffect(() => {
//         setListViewResults(supervisors); 
//       }, []);
    

//   const handleSearch = (val) => {
//     setQuery(val);
//     const result = applyFilters(supervisors, val, selectedUniversity, selectedField, selectedTopic);
//     setListViewResults(result);
//   };

//   const applyFilters = (data, queryStr, university, field, topic) => {
//     let result = data;
//     if (queryStr) {
//       result = result.filter(sup => sup.name.toLowerCase().includes(queryStr.toLowerCase()));
//     }
//     if (university) {
//       result = result.filter(sup => sup.university === university);
//     }
//     if (field) {
//       result = result.filter(sup => sup.field === field);
//     }
//     if (topic) {
//       result = result.filter(sup => sup.topics.includes(topic));
//     }
//     return result;
//   };

//   const universities = getUnique(supervisors, "university");
//   const fields = getUnique(
//     supervisors.filter(s => selectedUniversity ? s.university === selectedUniversity : true),
//     "field"
//   );
//   const topics = getUnique(
//     supervisors.filter(s => selectedField ? s.field === selectedField : true),
//     "topics"
//   ).flat();

//   const renderNoDoctorFound = () => (
//     <p style={{ marginTop: "1rem" }}>
//       Supervisor not found.{" "}
//       <span
//         style={{ color: "#0074E4", cursor: "pointer", textDecoration: "underline" }}
//         onClick={() => navigate("/add-doctor")}
//       >
//         Add doctor
//       </span>
//     </p>
//   );

//   return (
//     isSearchFocused && (
//       <div className="search-overlay">

//        <div className="settings-header">
//             <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
//             <h2>Leaderboard</h2>
//        </div>

//       <div className="container-leaderboard">
//   <div className="filter-bar">
//           {/* University Dropdown */}
//           <div className={`custom-select ${isUniversityOpen ? "open" : ""}`} ref={universityRef}>
//             <div
//               className={`select-header ${selectedUniversity ? "selected-header" : ""}`}
//               onClick={() => setIsUniversityOpen(!isUniversityOpen)}
//             >
//               {selectedUniversity || "All Universities"} <span className="arrow">&#9662;</span>
//             </div>
//             {isUniversityOpen && (
//               <div className="dropdown-overlay" style={{ zIndex: 300 }}>
//                 <ul className="doctor-list custom-dropdown">
//                   <li
//                     className={!selectedUniversity ? "lists selected" : "lists"}
//                     onClick={() => {
//                       setSelectedUniversity("");
//                       setSelectedField("");
//                       setSelectedTopic("");
//                       setIsUniversityOpen(false);
//                       handleSearch(query);
//                     }}
//                   >
//                     All Universities
//                   </li>
//                   {universities.map((uni, index) => (
//                     <li
//                       key={index}
//                       className={`lists ${selectedUniversity === uni ? "selected" : ""}`}
//                       onClick={() => {
//                         setSelectedUniversity(uni);
//                         setSelectedField("");
//                         setSelectedTopic("");
//                         setIsUniversityOpen(false);
//                         handleSearch(query);
//                       }}
//                     >
//                       {uni}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Field Dropdown */}
         
//             <div className={`custom-select ${isFieldOpen ? "open" : ""}`} ref={fieldRef}>
//               <div
//                 className={`select-header ${selectedField ? "selected-header" : ""}`}
//                 onClick={() => setIsFieldOpen(!isFieldOpen)}
//               >
//                 {selectedField || "All Fields"} <span className="arrow">&#9662;</span>
//               </div>
//               {isFieldOpen && (
//                 <div className="dropdown-overlay" style={{ zIndex: 300 }}>
//                   <ul className="doctor-list custom-dropdown">
//                     <li
//                       className={!selectedField ? "lists selected" : "lists"}
//                       onClick={() => {
//                         setSelectedField("");
//                         setSelectedTopic("");
//                         setIsFieldOpen(false);
//                         handleSearch(query);
//                       }}
//                     >
//                       All Fields
//                     </li>
//                     {fields.map((field, index) => (
//                       <li
//                         key={index}
//                         className={selectedField === field ? "lists selected" : "lists"}
//                         onClick={() => {
//                           setSelectedField(field);
//                           setSelectedTopic("");
//                           setIsFieldOpen(false);
//                           handleSearch(query);
//                         }}
//                       >
//                         {field}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//           {/* Topic Dropdown */}
//             <div className={`custom-select ${isTopicOpen ? "open" : ""}`} ref={topicRef}>
//               <div
//                 className={`select-header ${selectedTopic ? "selected-header" : ""}`}
//                 onClick={() => setIsTopicOpen(!isTopicOpen)}
//               >
//                 {selectedTopic || "All Topics"} <span className="arrow">&#9662;</span>
//               </div>
//               {isTopicOpen && (
//                 <div className="dropdown-overlay" style={{ zIndex: 300 }}>
//                   <ul className="doctor-list custom-dropdown">
//                     <li
//                       className={!selectedTopic ? "lists selected" : "lists"}
//                       onClick={() => {
//                         setSelectedTopic("");
//                         setIsTopicOpen(false);
//                         handleSearch(query);
//                       }}
//                     >
//                       All Topics
//                     </li>
//                     {topics.map((topic, index) => (
//                       <li
//                         key={index}
//                         className={selectedTopic === topic ? "lists selected" : "lists"}
//                         onClick={() => {
//                           setSelectedTopic(topic);
//                           setIsTopicOpen(false);
//                           handleSearch(query);
//                         }}
//                       >
//                         {topic}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//         </div>

//          {/* Doctor List */}
//         {listViewResults.length > 0 ? (
//         <DoctorList
//             doctors={listViewResults.map((doc, index) => ({
//                 ...doc,
//                 rank: index + 1 // Inject rank without touching name
//             }))}
//             onSelect={() => setIsSearchFocused(false)}
//             />
//         ) : (
//           renderNoDoctorFound()
//         )}
//       </div>
      

       
//       </div>
//     )
//   );
// };

// export default LeaderBoard;

import React, { useState } from "react";
import SearchBar from "./searchBar";

const UniversityDoctorList = ({ university }) => {
  const [query, setQuery] = useState("");

  const filteredDoctors = university.doctors.filter((doc) =>
    doc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h3>{university.name} - Doctors</h3>
      <SearchBar placeholder="Search Doctor in University..." onSearch={setQuery} />
      {filteredDoctors.length > 0 ? (
        filteredDoctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <img src={doc.image} alt={doc.name} />
            <p>{doc.name}</p>
          </div>
        ))
      ) : (
        <p>No doctor found in this university.</p>
      )}
    </div>
  );
};

export default UniversityDoctorList;

import React, { useState } from "react";
import SearchBar from "./searchBar";

const DoctorSearch = ({ doctors }) => {
  const [query, setQuery] = useState("");

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <SearchBar placeholder="Search Doctor..." onSearch={setQuery} />
      {filteredDoctors.length > 0 ? (
        <div className="doctor-list">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <img src={doc.image} alt={doc.name} />
              <p>{doc.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No doctor found.</p>
      )}
    </div>
  );
};

export default DoctorSearch;

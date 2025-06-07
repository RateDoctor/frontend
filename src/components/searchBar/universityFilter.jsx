import React, { useState } from "react";
import SearchBar from "./searchBar";

const UniversityFilter = ({ universities, onSelect }) => {
  const [query, setQuery] = useState("");

  const filtered = universities.filter((uni) =>
    uni.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <SearchBar placeholder="Search University..." onSearch={setQuery} />
      {filtered.length > 0 ? (
        <ul className="university-list">
          {filtered.map((uni) => (
            <li key={uni.id} onClick={() => onSelect(uni)}>
              {uni.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No university found.</p>
      )}
    </div>
  );
};

export default UniversityFilter;

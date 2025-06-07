import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./searchResult.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  return (
    <div className="search-results">
      <div className="results-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>Filtered Results</h2>
      </div>

      {results.length === 0 ? (
        <p>No supervisors found.</p>
      ) : (
        <ul className="results-list">
          {results.map((sup, index) => (
            <li key={index} className="result-item">
              <h3>{sup.name}</h3>
              <p><strong>University:</strong> {sup.university}</p>
              <p><strong>Field:</strong> {sup.field}</p>
              <p><strong>Rating:</strong> {sup.rating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;

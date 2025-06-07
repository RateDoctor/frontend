import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholder, onSearch, onFocus, onBlur }) => {
  return (
    <div className="search-bar">
      <FiSearch className="icon" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default SearchBar;

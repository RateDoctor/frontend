

import React, { useState , useEffect} from "react";
import { NavLink, Link } from "react-router-dom";

import "./index.css";

function SearchBar() {


  return (
    <>
      <div className="search-button">
        <Link
          id="search-button"
          className="nav-link  fas fa-search"
          >
          Search
        </Link>
      
      </div>

   

    </>
  );
}

export default SearchBar;


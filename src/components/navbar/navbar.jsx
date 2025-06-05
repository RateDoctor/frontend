import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import "./navbar.css"; // Create a separate CSS file

const Navbar = ({ title = "Explore", onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="nav-left" onClick={onBack}>
        <FiArrowLeft className="icon" />
        <span>{title}</span>
      </div>

      <div className="menu-wrapper" ref={menuRef}>
        <FiMoreVertical
          className="icon more-icon"
          onClick={() => setMenuOpen((prev) => !prev)}
        />
        {menuOpen && (
          <ul className="dropdown-menu">
            <li>Settings</li>
            <li>Saved Doctors</li>
            <li>My Ratings</li>
            <li>Contact Us</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;

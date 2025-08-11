import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";

import "./navbar.css";


const Navbar = ({ title = "Explore", onBack, userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigateAddDoctor = () => {
    if (role !== "admin") {
      alert("Only admins can add a doctor.");
      return;
    }
    navigate("/addDoctor");
  };


  

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
            <li onClick={() => navigate("/settings")}>Settings</li>
            <li onClick={() => navigate("/saved-doctors")}>Saved Doctors</li>
            <li onClick={() => navigate("/my-ratings")}>My Ratings</li>
            <li onClick={handleNavigateAddDoctor}>Add Doctor</li>
            <li onClick={() => navigate("/contact")}>Contact Us</li>
            {role !== 'admin' && (
            <li onClick={() => navigate("/request-admin-access")}>
              Request Admin Access
            </li>
          )}
            {isAdmin && <li><navigate to="/admin-dashboard">Admin Dashboard</navigate></li>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;




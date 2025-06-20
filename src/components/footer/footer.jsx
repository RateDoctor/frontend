import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiUsers, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./footer.css";

const Footer = ({ title = "Explore", onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

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
        <footer className="footer">
        <FiSearch className="icon" />
        <FiUsers className="icon" />
        <FiInfo className="icon" />
      </footer>
  );
};

export default Footer;



 
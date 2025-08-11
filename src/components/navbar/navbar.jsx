import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ title = "Explore", onBack, userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');

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
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;



// import React, { useState, useRef, useEffect } from "react";
// import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import "./navbar.css";

// const Navbar = ({ title = "Explore", onBack }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);





//   return (
//     <div className="navbar">
//       <div className="nav-left" onClick={onBack}>
//         <FiArrowLeft className="icon" />
//         <span>{title}</span>
//       </div>

//       <div className="menu-wrapper" ref={menuRef}>
//         <FiMoreVertical
//           className="icon more-icon"
//           onClick={() => setMenuOpen((prev) => !prev)}
//         />
//         {menuOpen && (
//           <ul className="dropdown-menu">
//             <li onClick={() => navigate("/settings")}>Settings</li>
//             <li onClick={() => navigate("/saved-doctors")}>Saved Doctors</li>
//             <li onClick={() => navigate("/my-ratings")}>My Ratings</li>
//             <li onClick={() => navigate("/AddDoctor")}>addDoctor</li>
//             <li onClick={() => navigate("/contact")}>Contact Us</li>
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

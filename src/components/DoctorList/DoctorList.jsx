// DoctorList.jsx — replace your current file with this
import React from "react";
import "./doctorList.css";
import { useNavigate } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";
import BookmarkButton from "../bookmark/BookmarkButton.jsx";

const DoctorList = ({ doctors = [], onSelect, onDoctorClick, showRank = false, onSaveDoctor }) => {
  const navigate = useNavigate();

  const getAvatarForDoctor = ({ image, gender } = {}) => {
    if (image) return image;
    if (gender === "female" || gender === "woman") return female;
    if (gender === "male" || gender === "man") return man;
    return defaultAvatar;
  };

  const handleSelect = (doc) => {
    // prefer explicit onSelect, fallback to onDoctorClick for backward compatibility
    const cb = onSelect || onDoctorClick;
    if (typeof cb === "function") cb(doc);
  };

  return (
    <ul className="doctor-list">
      {doctors.map((doc, index) => (
        <li
          key={doc._id || index}
          onClick={() => handleSelect(doc)}
          className="lists doctor-item"
        >
          {showRank && <span className="doctor-rank">{index + 1}</span>}
          <img
            src={getAvatarForDoctor(doc)}
            alt={doc.name || "Doctor Avatar"}
            className="doctor-list-img"
          />
          <span className="doctor-name">{doc.name || "Unnamed Doctor"}</span>
          <BookmarkButton doctor={doc} onSave={onSaveDoctor} />
        </li>
      ))}
    </ul>
  );
};

export default DoctorList;



// import React from "react";
// import "./doctorList.css";
// import { useNavigate } from "react-router-dom";
// import female from "../../imgs/female.svg";
// import man from "../../imgs/man-ezgif.com-gif-maker.svg";
// import defaultAvatar from "../../imgs/defaultAvatar.jpg";
// import BookmarkButton from "../bookmark/BookmarkButton.jsx"; 

// const DoctorList = ({ doctors, onSelect, showRank, onSaveDoctor }) => {
//   const navigate = useNavigate();



//   const getAvatarForDoctor = ({image, gender}) => {
//   console.log("Gender:", gender, "Image:", image);
//   if (image) return image;

//   if (gender === "female" || gender === "woman") {
//     return female;
//   } else if (gender === "male" || gender === "man") {
//     return man;
//   } else {
//     return defaultAvatar;
//   }
// };

//   return (
//     <ul className="doctor-list">
//       {doctors.map((doc, index) => (
//         <li
//           key={doc._id}
//           onClick={() => onSelect?.(doc)}
//           className="lists doctor-item"
//         >
//             {showRank && <span className="doctor-rank">{index + 1}</span>}          <img
//             src={getAvatarForDoctor(doc)}
//             alt={doc.name || "Doctor Avatar"}
//             className="doctor-list-img"
//           />
//           <span className="doctor-name">{doc.name}</span>
//           <BookmarkButton doctor={doc} onSave={onSaveDoctor} />
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default DoctorList;



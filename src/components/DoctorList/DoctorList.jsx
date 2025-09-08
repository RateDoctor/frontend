import React, { useRef, useEffect } from "react";
import "./doctorList.css";
import { useNavigate } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";
import BookmarkButton from "../bookmark/BookmarkButton.jsx";

const DoctorList = ({ doctors = [], showRank = false, onSaveDoctor }) => {
  const navigate = useNavigate();
  const listRef = useRef(null);

  const getAvatarForDoctor = ({ image, gender } = {}) => {
    if (image) return image;
    if (gender === "female" || gender === "woman") return female;
    if (gender === "male" || gender === "man") return man;
    return defaultAvatar;
  };

  const handleSelect = (doc) => {
    if (!doc?._id) return;
    navigate(`/admin-dr-profile/${doc._id}`);
  };

  // Optional: Scroll to top when list updates
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [doctors]);

  return (
    <div className="doctor-list-wrapper" ref={listRef}>
      <ul className="doctor-list">
        {doctors.map((doc, index) => (
          <li
            key={doc._id || index}
            onClick={() => handleSelect(doc)}
            className="lists doctor-item"
          >
            {showRank && <span className="doctor-rank">{index + 1}</span>}
            <img
              className='doctor-list-img'
              src={doc.profileImage?.fileUrl || getAvatarForDoctor(doc)}
              alt={doc.name || "Doctor Avatar"}
            />
            <span className="doctor-name">{doc.name || "Unnamed Doctor"}</span>
            <BookmarkButton doctor={doc} onSave={onSaveDoctor} />
          </li>
        ))}
      </ul>
    </div>
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

// const DoctorList = ({ doctors = [], showRank = false, onSaveDoctor }) => {
//   const navigate = useNavigate();

//   const getAvatarForDoctor = ({ image, gender } = {}) => {
//     if (image) return image;
//     if (gender === "female" || gender === "woman") return female;
//     if (gender === "male" || gender === "man") return man;
//     return defaultAvatar;
//   };

//   const handleSelect = (doc) => {
//     if (!doc?._id) return;
//     navigate(`/admin-dr-profile/${doc._id}`);
//   };

//   return (
//     <ul className="doctor-list">
//       {doctors.map((doc, index) => (
//         <li
//           key={doc._id || index}
//           onClick={() => handleSelect(doc)}
//           className="lists doctor-item"
//         >
//           {showRank && <span className="doctor-rank">{index + 1}</span>}
//           <img
//             className='doctor-list-img'
//             src={doc.profileImage?.fileUrl || getAvatarForDoctor(doc)}
//             alt={doc.name || "Doctor Avatar"}
//           />
//           <span className="doctor-name">{doc.name || "Unnamed Doctor"}</span>
//           <BookmarkButton doctor={doc} onSave={onSaveDoctor} />
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default DoctorList;


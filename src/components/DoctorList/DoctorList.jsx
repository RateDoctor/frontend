import React from "react";
import "./doctorList.css";
import { useNavigate } from "react-router-dom";
import female from "../../imgs/female.svg";
import man from "../../imgs/man-ezgif.com-gif-maker.svg";
import defaultAvatar from "../../imgs/defaultAvatar.jpg";

const DoctorList = ({ doctors, onSelect }) => {
  const navigate = useNavigate();



  const getAvatarForDoctor = ({image, gender}) => {
  console.log("Gender:", gender, "Image:", image);
  if (image) return image;

  if (gender === "female" || gender === "woman") {
    return female;
  } else if (gender === "male" || gender === "man") {
    return man;
  } else {
    return defaultAvatar;
  }
};
  // const getAvatarForDoctor = (doc) => {
  //   if (doc.image) return doc.image;
  //   if (doc.gender === "female" || doc.gender === "woman") return "/imgs/female.svg";
  //   if (doc.gender === "male" || doc.gender === "man") return "/imgs/man-ezgif.com-gif-maker.svg";
  //   return "/imgs/defaultAvatar.jpg";
  // };

  return (
    <ul className="doctor-list">
      {doctors.map((doc, index) => (
        <li
          key={doc._id}
          onClick={() => onSelect?.(doc)}
          className="lists doctor-item"
        >
          <span className="doctor-rank">#{index + 1}</span>
          <img
            src={getAvatarForDoctor(doc)}
            alt={doc.name || "Doctor Avatar"}
            className="doctor-list-img"
          />
          <span className="doctor-name">{doc.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default DoctorList;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./doctorList.css"; // Use this for custom styling

// const DoctorList = ({ doctors, onSelect, getAvatarForDoctor }) => {
//   const navigate = useNavigate();

//   return (
//     <ul className="doctor-list">
//       {doctors.map((doc, index) => (
//         <li
//           key={index}
//           onClick={() => {
//             if (onSelect) onSelect();
//             navigate(`/my-ratings/${doc._id}?new=true`);
//           }}
//           className="lists doctor-item"
//         >
//           <span className="doctor-rank">{doc.rank}</span>
//           {/* <img src={doc.image} alt={doc.name} className="doctor-list-img" /> */}

//           <img
//             src={getAvatarForDoctor ? getAvatarForDoctor(doc) : doc.image}
//             alt={doc.name || "Doctor Avatar"}
//             className="doctor-list-img"
//           />
//           <span className="doctor-name">{doc.name}</span>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default DoctorList;

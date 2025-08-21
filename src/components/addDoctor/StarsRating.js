import { FaStar } from "react-icons/fa";

const StarsRating = ({ rating, setRating, readOnly = false }) => {
  const renderStars = () => [1,2,3,4,5].map(star => (
    <FaStar
      key={star}
      size={24}
      color={star <= rating ? "#ffc107" : "#e4e5e9"}
      style={{ cursor: readOnly ? "default" : "pointer", marginRight: 4 }}
      onClick={() => !readOnly && setRating(star)}
      title={`${star} Star${star > 1 ? 's' : ''}`}
      aria-label={`${star} Star${star > 1 ? 's' : ''}`}
    />
  ));

  return (
    <div className="stars-rating">
      <label className="top-one-line label-addDoctor">Initial Rating *</label>
      <div className="stars-container">{renderStars()}</div>
    </div>
  );
};
export default StarsRating;

// import { FaStar } from "react-icons/fa";

// const StarsRating = ({ rating, setRating }) => {
//   const renderStars = () => {
//     return [1,2,3,4,5].map(star => (
//       <FaStar
//         key={star}
//         size={24}
//         color={star <= rating ? "#ffc107" : "#e4e5e9"}
//         style={{ cursor: 'pointer', marginRight: 4 }}
//         onClick={() => setRating(star)}
//         title={`${star} Star${star > 1 ? 's' : ''}`}
//       />
//     ));
//   };

//   return (
//     <div className="starts-rating">
//       <label className="top-one-line label-addDoctor">Initial Rating *</label>
//       <div className="stars-container">{renderStars()}</div>
//     </div>
//   );
// };

// export default StarsRating;

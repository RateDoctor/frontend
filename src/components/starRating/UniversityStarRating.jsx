import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UniversityStarRating = ({
  universityId,
  token,
  editable = true,
  onRatingSaved,   // callback after saving
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current user's rating on mount
  useEffect(() => {
    if (!universityId) return;
    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/university-ratings/${universityId}/my-rating`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRating(res.data.userRating || 0);
      } catch (err) {
        console.error("Error fetching university rating:", err);
      }
    };
    fetchRating();
  }, [universityId, token]);

  const handleClick = async (value) => {
    if (!editable) return;
    setRating(value);
    onRatingSaved?.(value);
    setIsSaving(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/university-ratings/`,
        { universityId, stars: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(res.data.stars);
      onRatingSaved?.(res.data.stars);
    } catch (err) {
      console.error("Failed to save university rating:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, position: "relative" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          onMouseEnter={() => editable && setHover(star)}
          onMouseLeave={() => editable && setHover(0)}
          onClick={() => handleClick(star)}
          style={{
            cursor: editable ? "pointer" : "default",
            color: star <= rating ? "#0074E4" : "#ccc",
            fontSize: 20,
          }}
        />
      ))}
      <span style={{ fontSize: 14, color: "#0074E4", marginLeft: 6 }}>{rating.toFixed(1)}</span>
      {editable && isSaving && (
        <span style={{ position: "absolute", right: -60, fontSize: 12, color: "#0074E4" }}>
          Saving...
        </span>
      )}
    </div>
  );
};

export default UniversityStarRating;

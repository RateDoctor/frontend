import React, { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa'; // Outline icon for "not saved"
import './bookmarkButton.css';

const BookmarkButton = ({ doctor }) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDoctors')) || [];
    const alreadySaved = saved.some((doc) => doc.id === doctor.id);
    setBookmarked(alreadySaved);
  }, [doctor.id]);

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('savedDoctors')) || [];
    if (!bookmarked) {
      const updated = [...saved, doctor];
      localStorage.setItem('savedDoctors', JSON.stringify(updated));
      setBookmarked(true);
    } else {
      const updated = saved.filter((d) => d.id !== doctor.id);
      localStorage.setItem('savedDoctors', JSON.stringify(updated));
      setBookmarked(false);
    }
  };

  return (
    <button className="bookmark-btn" onClick={handleBookmarkToggle} title="Save Doctor">
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarkButton;

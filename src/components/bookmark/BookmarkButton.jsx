// components/BookmarkButton.jsx
import React from 'react';
import { FaBookmark } from 'react-icons/fa';
import './bookmarkButton.css';

const BookmarkButton = ({ doctor, onSave }) => {
  return (
    <button
      className="bookmark-btn"
      onClick={(e) => {
        e.stopPropagation();
        onSave(doctor);
      }}
      title="Save Doctor"
    >
      <FaBookmark />
    </button>
  );
};

export default BookmarkButton;

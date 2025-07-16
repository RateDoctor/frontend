import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <FaLock className="unauthorized-icon" />
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <button className="unauthorized-btn" onClick={() => navigate('/')}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

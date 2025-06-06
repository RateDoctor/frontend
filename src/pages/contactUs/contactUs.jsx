import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
import "./contactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-us-container">
      <div className="contact-us-header">
        <FiArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>Contact Us</h2>
      </div>

      <div className="contact-us-body">
        <p className="paragraph-question">
          If you have any questions, concerns, or encounter issues while using our platform,
          please reach out to our support team. We are here to assist you.
        </p>

        <div className="email-section">
          <p className="email-label">Email:</p>
          <Link className="email-address">support@example.com</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React from 'react';
import './Helpfaq.css';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const HelpFAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="faq-container  ">
       <div className="settings-header">
                    <FiArrowLeft className="back-icon" onClick={() => navigate("/")} />
                    <h2>Help/FAQ</h2>
       </div>

     <section className="faq-child-container">
      <section className="">
        <h2 className="faq-title">Contact and Support</h2>
        <div className="faq-item">
          <p className="faq-question">Q: How can I contact support?</p>
          <p className="faq-answer">
            A: Use the "Contact Us" page or email <a href="mailto:support@example.com">support@example.com</a>. Our support team is ready to assist you.
          </p>
        </div>
        <div className="faq-item">
          <p className="faq-question">Q: What are the support hours?</p>
          <p className="faq-answer">
            A: Our support team is available during <strong>[specified hours]</strong>. Responses may take longer outside of these hours.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <h2 className="faq-title">Ratings and Reviews</h2>
        <div className="faq-item">
          <p className="faq-question">Q: How do I rate a admin?</p>
          <p className="faq-answer">
            A: Visit the admin's profile, select the “Rate” button, then follow the relevant criteria, and submit your rating along with optional comments.
          </p>
        </div>
        <div className="faq-item">
          <p className="faq-question">Q: Can I edit or delete my rating?</p>
          <p className="faq-answer">
            A: Once a rating is submitted, it cannot be edited or deleted. Ensure accuracy before submitting.
          </p>
        </div>
      </section>

      </section>
    </div>
  );
};

export default HelpFAQ;

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './supervisorDrProfile.css';
import PerformanceSection from "../../components/myRatings/PerformanceSection.jsx";
import DoctorProfileBox from './doctorProfileBox.jsx';
import useDoctorData from './useDoctorData.jsx';

const SupervisorDrProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();  // Extract doctorId from the URL

  const { doctorData, loading, error } = useDoctorData(doctorId);

  // If data is loading or error occurs, show loading/error state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Ensure doctorData and its properties exist before rendering
  if (!doctorData) {
    return <div>No doctor data available</div>;
  }

  return (
    <div className="container-superdrprofile">
      

      <div className="profile-superdrprofile">
        <DoctorProfileBox doctorData={doctorData} />

        {/* Affiliations Section */}
        {doctorData.affiliations && doctorData.affiliations.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Affiliations</h3>
            <ul>
              {doctorData.affiliations.map((item, index) => (
                <li key={index}>• {item.name} (Joined: {item.joined})</li>
              ))}
            </ul>
          </section>
        )}

        {/* Background Section */}
        {doctorData.background && doctorData.background.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Background</h3>
            <ul>
              {doctorData.background.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Teaching Section */}
        {doctorData.teaching && doctorData.teaching.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Teaching</h3>
            <ul>
              {doctorData.teaching.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Supervision Section */}
        {doctorData.supervision && doctorData.supervision.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Supervision</h3>
            <ul>
              {doctorData.supervision.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience Section */}
        {doctorData.experience && doctorData.experience.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Experience</h3>
            <ul>
              {doctorData.experience.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Rating Section */}
        <section className="section-superdrprofile">
          <h3>Rating Distribution</h3>
          <PerformanceSection showPercentage={true} hideTitle={true} />
        </section>

        {/* Feedback Section */}
        {doctorData.feedback && doctorData.feedback.length > 0 && (
          <section className="section-feedback">
            <h3>Students Feedback</h3>
            <ul className="feedback-lists">
              {doctorData.feedback.map((feedback, index) => (
                <li key={index} className="lists-of-feedback">
                  <span className="feedback-id">#{feedback.id}</span>
                  <p className="feedback-paragraph">" {feedback.text} "</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default SupervisorDrProfile;




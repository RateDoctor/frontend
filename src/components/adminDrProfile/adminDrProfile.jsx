import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorRatingSummary from "../DoctorRatingSummary/DoctorRatingSummary.jsx";
import DoctorProfileBox from './doctorProfileBox.jsx';
import useDoctorData from './useDoctorData.jsx';
import Loader from "../../layouts/load/load.jsx"; // ✅ Import your Loader
import './adminDrProfile.css';

const AdminDrProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();  // Extract doctorId from the URL

  const { doctorData, loading, error } = useDoctorData(doctorId);

  // Show Loader while fetching
  if (loading) {
    return <Loader type={1} />;  // you can adjust type if your Loader has variants
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Ensure doctorData exists
  if (!doctorData) {
    return <div>No doctor data available</div>;
  }

  return (
    <div className="container-superdrprofile">
      <div className="profile-superdrprofile">
        <DoctorProfileBox doctorData={doctorData} />

        {/* Affiliations Section */}
        {doctorData.affiliations?.length > 0 && (
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
        {doctorData.background?.length > 0 && (
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
        {doctorData.teaching?.length > 0 && (
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
        {doctorData.supervision?.length > 0 && (
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
        {doctorData.experience?.length > 0 && (
          <section className="section-superdrprofile">
            <h3>Experience</h3>
            <ul>
              {doctorData.experience.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        <DoctorRatingSummary doctorId={doctorId} />

      </div>
    </div>
  );
};

export default AdminDrProfile;

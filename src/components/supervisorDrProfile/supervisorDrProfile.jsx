import React from 'react';
import { useNavigate } from "react-router-dom";
import './supervisorDrProfile.css';
import Navbar from "../navbar/navbar";
import PerformanceSection from "../../components/myRatings/PerformanceSection.jsx";
import DoctorProfileBox from './doctorProfileBox.jsx';

const SupervisorDrProfile = () => {
  const navigate = useNavigate();

  const doctorData = {
    doctorName: 'Dr. John Doe',
    affiliations: [
      { name: 'University of Science and Technology', joined: 2018 },
      { name: 'Research Institute for AI', joined: 2022 },
    ],
    background: [
      'PhD in Computer Science',
      'Associate Professor',
      'Research Interests: ML, NLP, HCI',
    ],
    teaching: [
      'Courses: ML, HCI',
      'Philosophy: Engaging, inclusive learning',
    ],
    supervision: [
      '8 current PhD students',
      'Success stories: Graduates in academia, industry',
    ],
    experience: [
      'Stanford (Joined: 2010)',
      'MIT (Joined: 2015)',
      'Previous positions: Asst. Prof., Research Scientist',
    ]
  };

  return (
    <div className="container-superdrprofile">
      <Navbar
        title="Explore"
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
      />

      <div className="profile-superdrprofile">

       <DoctorProfileBox doctorData={doctorData} />
       

        <section className="section-superdrprofile">
          <h3>Affiliations</h3>
          <ul>
            {doctorData.affiliations.map((item, index) => (
              <li key={index}>• {item.name} (Joined: {item.joined})</li>
            ))}
          </ul>
        </section>

        <section className="section-superdrprofile">
          <h3>Background</h3>
          <ul>
            {doctorData.background.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="section-superdrprofile">
          <h3>Teaching</h3>
          <ul>
            {doctorData.teaching.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="section-superdrprofile">
          <h3>Supervision</h3>
          <ul>
            {doctorData.supervision.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="section-superdrprofile">
          <h3>Experience</h3>
          <ul>
            {doctorData.experience.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="section-superdrprofile">
          <h3>Rating Distribution</h3>
         <PerformanceSection showPercentage={true} />

        </section>
      </div>
    </div>
  );
};

export default SupervisorDrProfile;

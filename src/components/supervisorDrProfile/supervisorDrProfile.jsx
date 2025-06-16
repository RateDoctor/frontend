import React from 'react';
import { useNavigate } from "react-router-dom";
import './supervisorDrProfile.css';
import Navbar from "../navbar/navbar";
import PerformanceSection from "../../components/myRatings/PerformanceSection.jsx";
import DoctorProfileBox from './doctorProfileBox.jsx';
import { doctorData } from './data.js';

const SupervisorDrProfile = () => {
  const navigate = useNavigate();



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
         <PerformanceSection showPercentage={true} hideTitle={true} />
        </section>

        <section className="section-feedback">
          Students feedback

          <ul className='feedback-lists'>
            <li className='lists-of-feedback'><span className='feedback-id'>#69831</span><p className='feedback-paragraph'>"An outstanding supervisor! [Supervisor's Name] provided invaluable guidance throughout my PhD journey. Their passion for research, availability for discussions, and constructive feedback were key factors in my academic growth." 👍🏻 ❤️ </p></li>
            <li className='lists-of-feedback'><span className='feedback-id'>#8918</span><p className='feedback-paragraph'>"I feel fortunate to have had [Supervisor's Name] as my mentor. Their expertise, support, and encouragement significantly contributed to the success of my research. A dedicated and approachable supervisor who creates a positive and collaborative research atmosphere." 😃  </p></li>
            <li className='lists-of-feedback'><span className='feedback-id'>#86087</span><p className='feedback-paragraph'>"A mentor who goes above and beyond! [Supervisor's Name] not only provided expert guidance in my research but also created a sense of belonging within the research group. An approachable and dedicated supervisor." </p></li>
            <li className='lists-of-feedback'><span className='feedback-id'>#2992</span><p className='feedback-paragraph'>"Exceptional mentorship from [Supervisor's Name]. Their expertise in the field, combined with a supportive and understanding approach, made every aspect of the research process more enjoyable. Grateful for the guidance and encouragement."</p></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SupervisorDrProfile;

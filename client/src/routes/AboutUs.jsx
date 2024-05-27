import React from 'react';
import '../styles/aboutus.css';

const AboutUs = () => {
  return (
    <div className="container">
      <h1 className="title">About Us</h1>
      <section className="section">
        <h2 className="sectionTitle">Our Mission</h2>
        <p className="text">
          At HRApp, our mission is to simplify and streamline the HR processes
          for businesses of all sizes. We aim to provide innovative solutions
          that enhance efficiency, improve employee engagement, and drive
          organizational success.
        </p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Our Story</h2>
        <p className="text">
          Founded in 2020, HRApp was created by a team of HR professionals and
          software engineers who recognized the need for a comprehensive,
          easy-to-use HR management tool. Since our inception, we have grown
          rapidly and now serve hundreds of businesses across various
          industries.
        </p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Our Values</h2>
        <p className="text">
          <ul className="list">
            <li>Innovation: We continuously seek new ways to improve and innovate.</li>
            <li>Integrity: We act with honesty and transparency in all our dealings.</li>
            <li>Customer Focus: Our customers are at the heart of everything we do.</li>
            <li>Teamwork: We believe in the power of collaboration and teamwork.</li>
          </ul>
        </p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Meet Our Team</h2>
        <div className="teamGrid">
          <div className="teamMember">
            <img src="/path-to-image1.jpg" alt="Team Member 1" className="profilePic" />
            <h3 className="memberName">Jane Doe</h3>
            <p className="memberRole">CEO & Founder</p>
          </div>
          <div className="teamMember">
            <img src="/path-to-image1.jpg" alt="Team Member 1" className="profilePic" />
            <h3 className="memberName">Tim</h3>
            <p className="memberRole">CEO & Founder</p>
          </div>
          <div className="teamMember">
            <img src="/path-to-image1.jpg" alt="Team Member 1" className="profilePic" />
            <h3 className="memberName">Denis</h3>
            <p className="memberRole">CEO & Founder</p>
          </div>
        </div>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Contact Us</h2>
        <p className="text">
          Have any questions? Feel free to reach out to us at{' '}
          <a href="mailto:info@hrapp.com" className="link">info@hrapp.com</a>.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;

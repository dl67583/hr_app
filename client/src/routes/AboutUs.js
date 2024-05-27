import React from 'react';

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Us</h1>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.text}>
          At HRApp, our mission is to simplify and streamline the HR processes
          for businesses of all sizes. We aim to provide innovative solutions
          that enhance efficiency, improve employee engagement, and drive
          organizational success.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Story</h2>
        <p style={styles.text}>
          Founded in 2020, HRApp was created by a team of HR professionals and
          software engineers who recognized the need for a comprehensive,
          easy-to-use HR management tool. Since our inception, we have grown
          rapidly and now serve hundreds of businesses across various
          industries.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Values</h2>
        <p style={styles.text}>
          <ul style={styles.list}>
            <li>Innovation: We continuously seek new ways to improve and innovate.</li>
            <li>Integrity: We act with honesty and transparency in all our dealings.</li>
            <li>Customer Focus: Our customers are at the heart of everything we do.</li>
            <li>Teamwork: We believe in the power of collaboration and teamwork.</li>
          </ul>
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Meet Our Team</h2>
        <div style={styles.teamGrid}>
          <div style={styles.teamMember}>
            <img src="/path-to-image1.jpg" alt="Team Member 1" style={styles.profilePic} />
            <h3 style={styles.memberName}>Jane Doe</h3>
            <p style={styles.memberRole}>CEO & Founder</p>
          </div>
          <div style={styles.teamMember}>
            <img src="/path-to-image1.jpg" alt="Team Member 1" style={styles.profilePic} />
            <h3 style={styles.memberName}>Tim </h3>
            <p style={styles.memberRole}>CEO & Founder</p>
          </div>
          <div style={styles.teamMember}>
            <img src="/path-to-image1.jpg" alt="Team Member 1" style={styles.profilePic} />
            <h3 style={styles.memberName}>Denis</h3>
            <p style={styles.memberRole}>CEO & Founder</p>
          </div>
          
        </div>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <p style={styles.text}>
          Have any questions? Feel free to reach out to us at{' '}
          <a href="mailto:info@hrapp.com" style={styles.link}>info@hrapp.com</a>.
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    lineHeight: '1.6',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '40px',
    fontSize: '2.5em',
    fontWeight: '700',
  },
  section: {
    marginBottom: '30px',
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    color: '#34495e',
    borderBottom: '3px solid #115260',
    paddingBottom: '10px',
    marginBottom: '20px',
    fontSize: '1.75em',
    fontWeight: '600',
  },
  text: {
    color: '#555',
    fontSize: '1.1em',
  },
  list: {
    paddingLeft: '20px',
    listStyleType: 'disc',
  },
  link: {
    color: '#115260',
    textDecoration: 'none',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  teamMember: {
    textAlign: 'center',
    background: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  profilePic: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '10px',
    objectFit: 'cover',
  },
  memberName: {
    margin: '0',
    fontSize: '1.2em',
    color: '#2c3e50',
    fontWeight: '600',
  },
  memberRole: {
    margin: '0',
    color: '#7f8c8d',
    fontSize: '1em',
    fontWeight: '400',
  },
};

export default AboutUs;

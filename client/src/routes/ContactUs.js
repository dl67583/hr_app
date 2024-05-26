import React from 'react';

const ContactUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Customer Support</h2>
        <p style={styles.contactInfo}>Email: <a href="mailto:support@hrapp.com" style={styles.link}>support@hrapp.com</a></p>
        <p style={styles.contactInfo}>Phone: 1-800-555-1234</p>
        <p style={styles.supportHours}>Support hours: Monday to Friday, 9 AM - 6 PM (EST)</p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Technical Support</h2>
        <p style={styles.contactInfo}>Email: <a href="mailto:techsupport@hrapp.com" style={styles.link}>techsupport@hrapp.com</a></p>
        <p style={styles.contactInfo}>Phone: 1-800-555-5678</p>
        <p style={styles.supportHours}>Support hours: Monday to Friday, 8 AM - 8 PM (EST)</p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Sales Inquiries</h2>
        <p style={styles.contactInfo}>Email: <a href="mailto:sales@hrapp.com" style={styles.link}>sales@hrapp.com</a></p>
        <p style={styles.contactInfo}>Phone: 1-800-555-8765</p>
        <p style={styles.supportHours}>Sales hours: Monday to Friday, 9 AM - 5 PM (EST)</p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Mailing Address</h2>
        <p style={styles.address}>HR App, Inc.</p>
        <p style={styles.address}>1234 Business Park Road, Suite 100</p>
        <p style={styles.address}>Metropolis, State, ZIP Code</p>
        <p style={styles.address}>USA</p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Social Media</h2>
        <p style={styles.contactInfo}>Twitter: <a href="https://twitter.com/HRApp" target="_blank" rel="noopener noreferrer" style={styles.link}>HRApp</a></p>
        <p style={styles.contactInfo}>LinkedIn: <a href="https://linkedin.com/company/hrapp" target="_blank" rel="noopener noreferrer" style={styles.link}>HR App</a></p>
        <p style={styles.contactInfo}>Facebook: <a href="https://facebook.com/hrapp" target="_blank" rel="noopener noreferrer" style={styles.link}>HR App</a></p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Feedback</h2>
        <p style={styles.contactInfo}>We are always looking to improve our services. If you have any feedback or suggestions, please fill out our <a href="#feedback-form" style={styles.link}>feedback form</a> or email us at <a href="mailto:feedback@hrapp.com" style={styles.link}>feedback@hrapp.com</a>.</p>
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
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lineHeight: '1.6',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '40px',
    fontSize: '2.5em',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#444',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
    fontSize: '1.5em',
  },
  contactInfo: {
    margin: '5px 0',
    color: '#555',
    fontSize: '1.1em',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
  supportHours: {
    margin: '5px 0',
    color: '#999',
    fontSize: '0.9em',
  },
  address: {
    color: '#555',
    lineHeight: '1.6',
    fontSize: '1.1em',
  },
};

export default ContactUs;

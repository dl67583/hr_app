import React from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="title">Contact Us</h1>
      <section className="section">
        <h2 className="sectionTitle">Customer Support</h2>
        <p className="contactInfo">Email: <a href="mailto:support@hrapp.com" className="link">support@hrapp.com</a></p>
        <p className="contactInfo">Phone: 1-800-555-1234</p>
        <p className="supportHours">Support hours: Monday to Friday, 9 AM - 6 PM (EST)</p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Technical Support</h2>
        <p className="contactInfo">Email: <a href="mailto:techsupport@hrapp.com" className="link">techsupport@hrapp.com</a></p>
        <p className="contactInfo">Phone: 1-800-555-5678</p>
        <p className="supportHours">Support hours: Monday to Friday, 8 AM - 8 PM (EST)</p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Sales Inquiries</h2>
        <p className="contactInfo">Email: <a href="mailto:sales@hrapp.com" className="link">sales@hrapp.com</a></p>
        <p className="contactInfo">Phone: 1-800-555-8765</p>
        <p className="supportHours">Sales hours: Monday to Friday, 9 AM - 5 PM (EST)</p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Mailing Address</h2>
        <p className="address">HR App, Inc.</p>
        <p className="address">1234 Business Park Road, Suite 100</p>
        <p className="address">Metropolis, State, ZIP Code</p>
        <p className="address">USA</p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Social Media</h2>
        <p className="contactInfo">Twitter: <a href="https://twitter.com/HRApp" target="_blank" rel="noopener noreferrer" className="link">HRApp</a></p>
        <p className="contactInfo">LinkedIn: <a href="https://linkedin.com/company/hrapp" target="_blank" rel="noopener noreferrer" className="link">HR App</a></p>
        <p className="contactInfo">Facebook: <a href="https://facebook.com/hrapp" target="_blank" rel="noopener noreferrer" className="link">HR App</a></p>
      </section>
      <section className="section">
        <h2 className="sectionTitle">Feedback</h2>
        <p className="contactInfo">We are always looking to improve our services. If you have any feedback or suggestions, please fill out our <a href="#feedback-form" className="link">feedback form</a> or email us at <a href="mailto:feedback@hrapp.com" className="link">feedback@hrapp.com</a>.</p>
      </section>
    </div>
  );
};

export default ContactUs;

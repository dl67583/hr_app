import React, { useState } from 'react';
import "../styles/FAQ.css"; // Make sure to import your CSS file

function FAQ() {
  const [active, setActive] = useState(null);

  const faqData = [
    {
      question: 'What is the company’s leave policy?',
      answer: 'Our company offers 20 days of paid leave annually, including sick leave and personal days. Unused leave can be carried over to the next year.',
    },
    {
      question: 'How can I apply for maternity/paternity leave?',
      answer: 'To apply for maternity or paternity leave, please fill out the application form available on the HR portal and submit it to the HR department at least 4 weeks before the expected leave date.',
    },
    {
      question: 'What are the working hours?',
      answer: 'Our standard working hours are from 9:00 AM to 6:00 PM, Monday to Friday. Flexible working hours can be arranged with prior approval from your supervisor.',
    },
    {
      question: 'How do I report a workplace issue?',
      answer: 'You can report workplace issues anonymously through the online grievance form available on the HR portal or directly contact the HR department.',
    },
    {
      question: 'What benefits does the company offer?',
      answer: 'We offer a comprehensive benefits package including health insurance, retirement plans, wellness programs, and professional development opportunities.',
    },
    // Add more FAQ data here
  ];

  const handleAccordionClick = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Human Resources FAQs</h2>
      {faqData.map((item, index) => (
        <div key={index} className={`accordion ${active === index ? 'active' : ''}`} onClick={() => handleAccordionClick(index)}>
          <div className="accordion__question">
            <p>{item.question}</p>
          </div>
          <div className="accordion__answer">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQ;

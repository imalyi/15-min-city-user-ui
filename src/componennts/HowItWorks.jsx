// Komponent HowItWorks.jsx
import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = ({ howItWorksText }) => {
  return (
    <div className="how-it-works">
      <textarea
        value={howItWorksText}
        readOnly
        className="text"
      />
    </div>
  );
};

export default HowItWorks;

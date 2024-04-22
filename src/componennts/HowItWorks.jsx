// Komponent HowItWorks.jsx
import React from 'react';
import '../styles/HowItWorks.css';
import { logger } from '../logger';

//check

const HowItWorks = ({ howItWorksText }) => {
  return (
    <div className="how-it-works">
      <textarea value={howItWorksText} readOnly className="text" />
    </div>
  );
};

export default HowItWorks;

// About.jsx
import React from 'react';
import Footer from './Footer';
import { logger } from '../logger';

function About() {
  const aboutInfo = 'Information from About Component';

  return (
    <div>
      <h1>About Page</h1>
      <p>Hello world</p>
      <Footer additionalInfo={aboutInfo} />
    </div>
  );
}

export default About;

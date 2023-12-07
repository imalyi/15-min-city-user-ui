// Footer.js
import React from 'react';
import '../styles/Footer.css';

function Footer({ additionalInfo }) {
  return (
    <div className="footer bg-dark text-light p-3">
      <div className="container text-center">
        <p>{additionalInfo}</p>
        <p>© 15 minut city</p>
      </div>
    </div>
  );
}

export default Footer;

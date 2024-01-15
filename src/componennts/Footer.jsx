import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className="footer bg-dark text-light p-3">
      <div className="container text-center">
        <p>
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>
        </p>
        <p>
          <a
            href="https://www.trojmiasto.pl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trojmiasto.pl
          </a>
        </p>
        <p>©cityinminutes.me</p>
      </div>
    </div>
  );
}

export default Footer;

import React from 'react';
import './Footer.css'; // Import your CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/contact-us" className="footer-link">Contact Us</a>
        <a href="/terms-of-service" className="footer-link">Terms of Service</a>
      </div>
      <div className="language-selector">
        <label htmlFor="language">Language:</label>
        <select id="language" name="language">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <!-- Add more languages as needed -->
        </select>
      </div>
      <div className="social-media-icons">
        {/* Optional social media icons */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">FB</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">TW</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">IG</a>
      </div>
    </footer>
  );
};

export default Footer; 
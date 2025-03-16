import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} FCU SHS Marketplace | <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a> | <a href="/support">Contact Support</a></p>
      </div>
    </footer>
  );
}

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-container">
              <img src="/logo.png" alt="GDP" className="footer-site-logo" />
              <div className="footer-site-text">
                <span>Garima</span>
                <span>Dance</span>
                <span>Productions</span>
              </div>
            </Link>
          </div>

          <div className="footer-links">
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/testimonials">Reviews</Link></li>
              <li><Link to="/blog">Blogs</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Regular Dance Sessions</Link></li>
              <li><Link to="/services">Fitness Sessions</Link></li>
              <li><Link to="/services">Wedding Choreography</Link></li>
              <li><Link to="/services">Custom Choreography</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Social media</h4>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer">Youtube</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact us</h4>
            <p>Address: K-6, near SANDISH MEDICAL, Sector-12, Block-K, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009</p>
            <p>Phone: <a href="tel:9711384768">9711384768</a></p>
            <p>Email us: <a href="mailto:Garima@productions.com">Garima@productions.com</a></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>copyright@2024 Garima dance productions, All rights reserved</p>
          <div className="footer-bottom-links">
             <Link to="/terms">Terms and conditions</Link>
             <Link to="/privacy">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


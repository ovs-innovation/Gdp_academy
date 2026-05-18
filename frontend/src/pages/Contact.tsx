import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import '../styles/contact.css';

const Contact: React.FC = () => {
  return (
    <Layout>
      <SEO pageTitle="Contact Us" />
      
      <div className="contact-page-wrapper">
        <div className="contact-ambient"></div>
        <div className="contact-ambient-2"></div>
        
        <div className="contact-container">
          {/* Left Info Side */}
          <motion.div 
            className="contact-info-side"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="contact-hero-title">
              LET'S <span>CONNECT.</span>
            </h1>
            <p className="contact-hero-subtitle">
              Whether you're a beginner taking your first step, or a professional looking for elite training, our doors are open.
            </p>

            <div className="contact-details-grid">
              <div className="contact-detail-block">
                <h4>THE STUDIO</h4>
                <p>123 Dance Avenue<br />Art District<br />New York, NY 10001</p>
              </div>
              
              <div className="contact-detail-block">
                <h4>CONTACT</h4>
                <p>hello@gdpacademy.com<br />+1 (555) 123-4567</p>
              </div>

              <div className="contact-detail-block">
                <h4>HOURS</h4>
                <p>Mon-Fri: 9AM - 10PM<br />Sat-Sun: 10AM - 8PM</p>
              </div>
              
              <div className="contact-detail-block">
                <h4>SOCIALS</h4>
                <p style={{ display: 'flex', gap: '15px' }}>
                  <a href="#" style={{ color: 'var(--svc-green)', textDecoration: 'none' }}>IG</a>
                  <a href="#" style={{ color: 'var(--svc-green)', textDecoration: 'none' }}>YT</a>
                  <a href="#" style={{ color: 'var(--svc-green)', textDecoration: 'none' }}>TK</a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Form Side */}
          <motion.div 
            className="contact-form-side"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="c-form-group">
                <label>YOUR NAME</label>
                <input type="text" className="c-form-input" placeholder="e.g. John Doe" />
              </div>
              
              <div className="c-form-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" className="c-form-input" placeholder="john@example.com" />
              </div>
              
              <div className="c-form-group">
                <label>INTERESTED IN</label>
                <input type="text" className="c-form-input" placeholder="e.g. Hip Hop, Wedding, Private..." />
              </div>
              
              <div className="c-form-group">
                <label>MESSAGE</label>
                <textarea className="c-form-textarea" placeholder="Tell us about your dance goals..."></textarea>
              </div>
              
              <button type="submit" className="c-submit-btn">SEND MESSAGE</button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

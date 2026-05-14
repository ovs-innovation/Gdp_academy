import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <Layout>
      <section className="contact-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            GET IN <span className="gradient-text">TOUCH</span>
          </motion.h1>
          <p className="hero-subtitle">Have questions about our programs or memberships? Our team is here to help.</p>
        </div>
      </section>

      <section className="contact-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="cta-content glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '60px' }}>
            <div className="contact-info">
              <h2 style={{ marginBottom: '32px' }}>CONTACT <span className="gradient-text">US</span></h2>
              <div className="info-item" style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--accent-color)', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>VISIT US</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-gray)' }}>123 Dance Avenue, Art District<br />New York, NY 10001</p>
              </div>
              <div className="info-item" style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--accent-color)', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>EMAIL</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-gray)' }}>hello@gdpacademy.com<br />support@gdpacademy.com</p>
              </div>
              <div className="info-item" style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--accent-color)', fontSize: '12px', letterSpacing: '2px', marginBottom: '8px' }}>PHONE</h4>
                <p style={{ fontSize: '15px', color: 'var(--text-gray)' }}>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="contact-form-container">
              <form className="auth-form">
                <div className="form-group">
                  <label>FULL NAME</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" placeholder="name@example.com" />
                </div>
                <div className="form-group">
                  <label>MESSAGE</label>
                  <textarea placeholder="How can we help you?" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', color: '#fff', borderRadius: '4px', minHeight: '120px' }}></textarea>
                </div>
                <button type="submit" className="primary-btn join-btn w-full" style={{ marginTop: '20px' }}>SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

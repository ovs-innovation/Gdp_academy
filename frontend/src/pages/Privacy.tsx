import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <Layout>
      <section className="legal-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            PRIVACY <span className="gradient-text">POLICY</span>
          </motion.h1>
          <p className="hero-subtitle">Last Updated: May 12, 2026</p>
        </div>
      </section>

      <section className="legal-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-gray)', lineHeight: '1.8' }}>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>1. Data Collection</h2>
            <p style={{ marginBottom: '30px' }}>We collect personal information such as your name, email, and payment details when you register for a membership. We also track usage data to improve our educational content.</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>2. Use of Information</h2>
            <p style={{ marginBottom: '30px' }}>Your data is used to provide access to the platform, process payments, and communicate academy updates. We do not sell your personal information to third parties.</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>3. Data Security</h2>
            <p style={{ marginBottom: '30px' }}>We implement industry-standard security measures to protect your data. Payment information is processed through secure, encrypted providers (e.g., Stripe/PayPal).</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>4. Your Rights</h2>
            <p style={{ marginBottom: '30px' }}>You have the right to access, correct, or delete your personal data at any time through your member dashboard or by contacting support.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;

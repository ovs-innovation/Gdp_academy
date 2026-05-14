import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <Layout>
      <section className="legal-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            TERMS OF <span className="gradient-text">SERVICE</span>
          </motion.h1>
          <p className="hero-subtitle">Last Updated: May 12, 2026</p>
        </div>
      </section>

      <section className="legal-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-gray)', lineHeight: '1.8' }}>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>1. Acceptance of Terms</h2>
            <p style={{ marginBottom: '30px' }}>By accessing and using the GDP Academy platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>2. Membership & Payments</h2>
            <p style={{ marginBottom: '30px' }}>Memberships are billed based on the plan selected. Payments are non-refundable unless otherwise specified. GDP Academy reserves the right to modify pricing with 30 days notice.</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>3. Code of Conduct</h2>
            <p style={{ marginBottom: '30px' }}>All members are expected to maintain a professional and respectful environment during live sessions and in the community forums. Harassment or disruptive behavior will result in immediate termination of membership.</p>
            
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>4. Intellectual Property</h2>
            <p style={{ marginBottom: '30px' }}>All video content, choreography, and educational materials provided on this platform are the property of GDP Academy and may not be reproduced or shared without explicit permission.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;

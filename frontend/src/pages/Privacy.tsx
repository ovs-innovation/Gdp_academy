import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { getPageContentBySlug } from '../services/cmsService';

const Privacy: React.FC = () => {
  const defaultSections = [
    {
      title: "1. Data Collection",
      text: "We collect personal information such as your name, email, and payment details when you register for a membership. We also track usage data to improve our educational content."
    },
    {
      title: "2. Use of Information",
      text: "Your data is used to provide access to the platform, process payments, and communicate academy updates. We do not sell your personal information to third parties."
    },
    {
      title: "3. Data Security",
      text: "We implement industry-standard security measures to protect your data. Payment information is processed through secure, encrypted providers (e.g., Stripe/PayPal)."
    },
    {
      title: "4. Your Rights",
      text: "You have the right to access, correct, or delete your personal data at any time through your member dashboard or by contacting support."
    }
  ];

  const [sections, setSections] = useState<any[]>(defaultSections);

  useEffect(() => {
    getPageContentBySlug('privacy')
      .then((page) => {
        if (page && page.content && page.content.sections) {
          setSections(page.content.sections);
        }
      })
      .catch((err) => console.error("Error loading privacy content:", err));
  }, []);

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
            {sections.map((sec, idx) => (
              <React.Fragment key={idx}>
                <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>{sec.title}</h2>
                <p style={{ marginBottom: idx === sections.length - 1 ? '0' : '30px' }}>{sec.text}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;


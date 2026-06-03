import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { getPageContentBySlug } from '../services/cmsService';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  const defaultSections = [
    {
      title: "1. Acceptance of Terms",
      text: "By accessing and using the GDP Studio platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services."
    },
    {
      title: "2. Membership & Payments",
      text: "Memberships are billed based on the plan selected. Payments are non-refundable unless otherwise specified. GDP Studio reserves the right to modify pricing with 30 days notice."
    },
    {
      title: "3. Code of Conduct",
      text: "All members are expected to maintain a professional and respectful environment during live sessions and in the community forums. Harassment or disruptive behavior will result in immediate termination of membership."
    },
    {
      title: "4. Intellectual Property",
      text: "All video content, choreography, and educational materials provided on this platform are the property of GDP Studio and may not be reproduced or shared without explicit permission."
    }
  ];

  const [sections, setSections] = useState<any[]>(defaultSections);

  useEffect(() => {
    getPageContentBySlug('terms')
      .then((page) => {
        if (page && page.content && page.content.sections) {
          setSections(page.content.sections);
        }
      })
      .catch((err) => console.error("Error loading terms content:", err));
  }, []);

  return (
    <Layout>
      <SEO pageTitle="Terms of Service" path="/terms" />
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

export default Terms;

import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
  const services = [
    {
      title: "PRIVATE COACHING",
      desc: "One-on-one sessions with our elite dance coaches for rapid technical growth and personalized choreography.",
      icon: "★"
    },
    {
      title: "STUDIO RENTAL",
      desc: "Book our world-class dance studios for your own rehearsals, video shoots, or private practice.",
      icon: "✦"
    },
    {
      title: "VIDEO AUDITIONS",
      desc: "Professional recording services for your audition tapes, with lighting, sound, and coaching support.",
      icon: "▶"
    },
    {
      title: "WEDDING CHOREOGRAPHY",
      desc: "Custom choreography and training to make your first dance an unforgettable cinematic experience.",
      icon: "♥"
    }
  ];

  return (
    <Layout>
      <section className="services-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            BEYOND THE <span className="gradient-text">STUDIO</span>
          </motion.h1>
          <p className="hero-subtitle">Premium dance services tailored to your professional and personal needs.</p>
        </div>
      </section>

      <section className="services-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
            {services.map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="service-card glass-card"
                style={{ padding: '50px', textAlign: 'center' }}
              >
                <div className="service-icon" style={{ fontSize: '40px', color: 'var(--accent-color)', marginBottom: '25px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '22px', marginBottom: '20px', color: '#fff', letterSpacing: '2px' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-gray)', lineHeight: '1.6', fontSize: '15px' }}>{service.desc}</p>
                <button className="primary-btn join-btn" style={{ marginTop: '30px' }}>INQUIRE NOW</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

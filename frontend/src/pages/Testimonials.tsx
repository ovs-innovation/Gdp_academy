import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import testimonial_data from '../data/home-data/TestimonialData';

const Testimonials: React.FC = () => {
  return (
    <Layout>
      <section className="testimonials-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            ARTISTIC <span className="gradient-text">VOICES</span>
          </motion.h1>
          <p className="hero-subtitle">Real stories of transformation and excellence from the GDP Academy community.</p>
        </div>
      </section>

      <section className="testimonials-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            {testimonial_data.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="testimonial-card glass-card"
                style={{ padding: '60px', position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '60px', opacity: 0.1, color: 'var(--accent-color)' }}>"</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: '18px', color: 'var(--text-white)', marginBottom: '30px', lineHeight: '1.8', fontStyle: 'italic' }}>
                    {t.desc}
                  </p>
                  <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{t.name}</h4>
                      <span style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: '600' }}>{t.designation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Optional Video Testimonials Section placeholder */}
          <div className="video-testimonials section-padding" style={{ marginTop: '80px', textAlign: 'center' }}>
            <h2 className="section-title" style={{ fontSize: '32px' }}>VIDEO <span className="gradient-text">EXPERIENCES</span></h2>
            <div className="gallery-grid" style={{ marginTop: '40px' }}>
               {[1, 2].map(idx => (
                 <div key={idx} className="glass-card" style={{ height: '350px', position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
                    <img src={`https://images.unsplash.com/photo-${idx === 1 ? '1547153760-18fc86324498' : '1508700115892-45ecd05ae2ad'}?auto=format&fit=crop&q=80`} alt="Video Testimonial" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="play-btn-pulse" style={{ background: 'var(--primary-color)' }}>▶</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;

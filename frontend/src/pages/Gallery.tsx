import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Gallery: React.FC = () => {
  const photos = [
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1537367680248-a449a6affb04?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502519144081-acca18599766?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80"
  ];

  return (
    <Layout>
      <section className="gallery-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="section-title"
          >
            ART IN <span className="gradient-text">MOTION</span>
          </motion.h1>
          <p className="hero-subtitle">Capturing the raw emotion and precision of our academy's performances.</p>
        </div>
      </section>

      <section className="gallery-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="gallery-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            gridAutoRows: '300px'
          }}>
            {photos.map((photo, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gallery-item"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
              >
                <img 
                  src={photo} 
                  alt={`Gallery ${i}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;

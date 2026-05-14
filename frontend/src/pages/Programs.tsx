import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import '../styles/programs.css';

const Programs: React.FC = () => {
  const styles = [
    { id: 1, name: 'Classical Ballet', level: 'Beginner to Advanced', coach: 'Elena Volkova', image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80', price: '$49/mo' },
    { id: 2, name: 'Contemporary', level: 'Intermediate', coach: 'Marcus Chen', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80', price: '$55/mo' },
    { id: 3, name: 'Urban Hip-Hop', level: 'All Levels', coach: 'Jordan Knight', image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80', price: '$45/mo' },
    { id: 4, name: 'Jazz Fusion', level: 'Advanced', coach: 'Sarah Miller', image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80', price: '$50/mo' },
    { id: 5, name: 'Latin Ballroom', level: 'Beginner', coach: 'Ricardo Silva', image: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&q=80', price: '$60/mo' },
    { id: 6, name: 'Breakdance', level: 'Intermediate', coach: 'B-Boy Rush', image: 'https://images.unsplash.com/photo-1537367680248-a449a6affb04?auto=format&fit=crop&q=80', price: '$40/mo' },
  ];

  return (
    <Layout>
      <section className="programs-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="section-title"
          >
            OUR <span className="gradient-text">PROGRAMS</span>
          </motion.h1>
          <p className="hero-subtitle">Discover your style and master the technique with our professional curriculum.</p>
        </div>
      </section>

      <section className="programs-filter section-padding">
        <div className="container">
          <div className="filter-bar">
            <button className="filter-btn active">ALL DISCIPLINES</button>
            <button className="filter-btn">CLASSICAL</button>
            <button className="filter-btn">URBAN</button>
            <button className="filter-btn">LATIN</button>
            <button className="filter-btn">MODERN</button>
          </div>

          <div className="programs-grid">
            {styles.map((style) => (
              <motion.div 
                key={style.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="program-card glass-card"
              >
                <div className="program-image">
                  <img src={style.image} alt={style.name} />
                  <div className="price-tag">{style.price}</div>
                  <div className="program-overlay">
                     <button className="primary-btn">ENROLL NOW</button>
                  </div>
                </div>
                <div className="program-info">
                  <div className="program-meta">
                    <span className="level-badge">{style.level}</span>
                  </div>
                  <h3>{style.name}</h3>
                  <p className="coach-name">Dance Coach: {style.coach}</p>
                  <div className="program-footer">
                    <button className="text-btn">VIEW CURRICULUM →</button>
                    <a 
                      href={`https://api.whatsapp.com/send?text=Join me for ${style.name} at GDP Academy! Check it out: ${window.location.href}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whatsapp-share-btn"
                      title="Share on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.031 6.172c-2.32 0-4.591 1.199-6.063 3.328-1.544 2.224-1.61 4.405-.166 6.55l-1.042 3.805 3.901-1.023c1.025.565 2.148.86 3.287.86 3.527 0 6.391-2.864 6.391-6.39 0-3.527-2.864-6.33-6.308-6.33zm5.023 9.032c-.173.483-.984.887-1.346.945-.333.053-.761.085-1.229-.074-.298-.101-.676-.239-1.144-.442-2.001-.868-3.298-2.924-3.398-3.058-.1-.134-.813-1.08-.813-2.06 0-.98.511-1.463.693-1.663.181-.2.395-.25.526-.25.132 0 .263.003.377.01.114.007.268-.043.42.321.157.377.537 1.312.584 1.41.047.098.079.213.013.344-.066.131-.098.213-.197.328-.098.115-.207.256-.296.344-.098.098-.201.205-.086.402.115.197.512.844 1.103 1.37.761.677 1.4.887 1.6.986.2.1.317.085.434-.05.117-.134.502-.585.636-.786.135-.201.27-.168.455-.098.185.07.1.536 1.171 1.036.185.085.309.127.453.223.144.095.144.18.047.453z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;


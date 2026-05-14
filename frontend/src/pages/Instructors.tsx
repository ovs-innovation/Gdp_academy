import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import '../styles/instructors.css';

const Instructors: React.FC = () => {
  const coaches = [
    { id: 1, name: 'Elena Volkova', specialty: 'Classical Ballet', bio: 'Former soloist at the Bolshoi Theatre with 20 years of coaching experience.', image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Marcus Chen', specialty: 'Contemporary', bio: 'Award-winning choreographer known for his fluid and expressive movement style.', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80' },
    { id: 3, name: 'Jordan Knight', specialty: 'Urban Hip-Hop', bio: 'Pioneer of the street dance scene, bringing raw energy and authentic rhythm.', image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Sarah Miller', specialty: 'Jazz Fusion', bio: 'Expert in technical precision and stage performance excellence.', image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80' },
  ];

  return (
    <Layout>
      <section className="instructors-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            MEET OUR <span className="gradient-text">DANCE COACHES</span>
          </motion.h1>
          <p className="hero-subtitle">Learn from the masters who have graced the world's most prestigious stages.</p>
        </div>
      </section>

      <section className="instructors-list section-padding">
        <div className="container">
          <div className="coaches-grid">
            {coaches.map((coach) => (
              <motion.div 
                key={coach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="coach-card glass-card"
              >
                <div className="coach-image">
                  <img src={coach.image} alt={coach.name} />
                  <div className="coach-overlay">
                    <div className="coach-socials">
                      <a href="#">INSTAGRAM</a>
                      <a href="#">YOUTUBE</a>
                      <a href="#">LINKEDIN</a>
                    </div>
                  </div>
                </div>
                <div className="coach-info">
                  <span className="coach-specialty gradient-text">{coach.specialty}</span>
                  <h3>{coach.name}</h3>
                  <p className="coach-bio">{coach.bio}</p>
                  <button className="text-btn">VIEW PERFORMANCE REEL →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Instructors;


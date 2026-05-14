import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const VideoLibrary: React.FC = () => {
  const videos = [
    { id: 1, title: 'Mastering the Pirouette', coach: 'Elena Volkova', duration: '15:20', thumb: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80', level: 'Advanced' },
    { id: 2, title: 'Urban Foundation: Footwork', coach: 'Jordan Knight', duration: '12:45', thumb: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80', level: 'Beginner' },
    { id: 3, title: 'Contemporary Floorwork', coach: 'Marcus Chen', duration: '20:10', thumb: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80', level: 'Intermediate' },
    { id: 4, title: 'Jazz Dynamics & Energy', coach: 'Sarah Miller', duration: '18:30', thumb: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80', level: 'All Levels' },
    { id: 5, title: 'Latin Rhythm Masterclass', coach: 'Ricardo Silva', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&q=80', level: 'Intermediate' },
    { id: 6, title: 'Breaking the Limits', coach: 'B-Boy Rush', duration: '14:20', thumb: 'https://images.unsplash.com/photo-1537367680248-a449a6affb04?auto=format&fit=crop&q=80', level: 'Beginner' },
  ];

  return (
    <Layout>
      <section className="library-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="section-title"
          >
            VIDEO <span className="gradient-text">ARCHIVE</span>
          </motion.h1>
          <p className="hero-subtitle">Access our complete library of recorded dance sessions and masterclasses.</p>
        </div>
      </section>

      <section className="library-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="filter-bar" style={{ marginBottom: '40px', display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
             <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: '700', color: 'var(--accent-color)' }}>FILTER BY:</span>
             <button className="text-btn active">ALL SESSIONS</button>
             <button className="text-btn">MASTERCLASSES</button>
             <button className="text-btn">DRILLS</button>
             <button className="text-btn">PERFORMANCES</button>
          </div>

          <div className="programs-grid">
            {videos.map((video) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="video-card glass-card"
                style={{ padding: '0', overflow: 'hidden' }}
              >
                <div className="video-thumb" style={{ position: 'relative', height: '200px' }}>
                   <img src={video.thumb} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   <div className="duration-badge" style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', fontSize: '10px', borderRadius: '2px' }}>{video.duration}</div>
                   <div className="play-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(99, 75, 250, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>▶</div>
                   </div>
                </div>
                <div className="video-info" style={{ padding: '20px' }}>
                   <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-color)' }}>{video.level}</span>
                   <h3 style={{ fontSize: '18px', margin: '8px 0', fontFamily: 'Montserrat', fontWeight: '700', textTransform: 'none' }}>{video.title}</h3>
                   <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Dance Coach: {video.coach}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .video-card:hover .play-overlay {
          opacity: 1;
        }
        .video-card:hover img {
          transform: scale(1.05);
          transition: 0.5s;
        }
      `}</style>
    </Layout>
  );
};

export default VideoLibrary;

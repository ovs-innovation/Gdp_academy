import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Workshops: React.FC = () => {
  const workshops = [
    {
      id: 1,
      title: "Mastering the Stage: Professional Presence",
      coach: "Elena Volkova",
      date: "Nov 15, 2024",
      time: "10:00 AM - 02:00 PM",
      price: "$120",
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Urban Choreography Intensives",
      coach: "Jordan Knight",
      date: "Nov 22, 2024",
      time: "03:00 PM - 07:00 PM",
      price: "$95",
      image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Contemporary Flow & Improv",
      coach: "Marcus Chen",
      date: "Dec 05, 2024",
      time: "11:00 AM - 04:00 PM",
      price: "$150",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <Layout>
      <section className="workshops-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            MASTER <span className="gradient-text">WORKSHOPS</span>
          </motion.h1>
          <p className="hero-subtitle">Intensive training sessions led by world-renowned dance masters.</p>
        </div>
      </section>

      <section className="workshops-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="workshops-list" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {workshops.map((workshop, i) => (
              <motion.div 
                key={workshop.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="workshop-card glass-card"
                style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', padding: '30px', alignItems: 'center' }}
              >
                <div className="workshop-image" style={{ height: '300px', overflow: 'hidden' }}>
                  <img src={workshop.image} alt={workshop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="workshop-details">
                  <span style={{ color: 'var(--accent-color)', fontSize: '12px', letterSpacing: '2px', fontWeight: '700' }}>{workshop.date} | {workshop.time}</span>
                  <h3 style={{ fontSize: '28px', margin: '15px 0', color: '#fff', fontFamily: 'Montserrat', fontWeight: '700' }}>{workshop.title}</h3>
                  <p style={{ color: 'var(--text-gray)', marginBottom: '25px', fontSize: '16px' }}>Led by {workshop.coach}. This intensive workshop focuses on advanced techniques and professional performance standards.</p>
                  <div className="workshop-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', color: 'var(--accent-color)', fontWeight: '700' }}>{workshop.price}</span>
                    <button className="primary-btn join-btn">BOOK WORKSHOP</button>
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

export default Workshops;

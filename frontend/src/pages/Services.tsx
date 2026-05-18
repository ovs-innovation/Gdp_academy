import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import '../styles/services.css';
import SEO from '../components/SEO';

const Services: React.FC = () => {

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const servicesList = [
    {
      title: "Hip Hop Training",
      desc: "Master street foundations, grooves, and advanced textures in a high-energy environment.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    },
    {
      title: "Beginner Classes",
      desc: "Step-by-step fundamentals designed to build confidence, rhythm, and body control from scratch.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
    },
    {
      title: "Choreography Sessions",
      desc: "Learn complex routines, musicality, and performance dynamics from elite industry mentors.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
    },
    {
      title: "Kids Dance Program",
      desc: "A fun, disciplined structure for young dancers to develop coordination and creative expression.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    },
    {
      title: "Stage Performance Prep",
      desc: "Advanced training focused on camera awareness, blocking, and live audience impact.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 3-9h6"></path></svg>
    },
    {
      title: "Wedding Choreography",
      desc: "Custom elegant and cinematic choreography to make your special moments unforgettable.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    },
    {
      title: "Battle Training",
      desc: "Freestyle techniques, musicality drills, and battle tactics for competitive underground scenes.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"></path></svg>
    },
    {
      title: "Dance Fitness",
      desc: "Intense, rhythm-based cardio sessions designed to build stamina and core strength.",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
    }
  ];

  return (
    <Layout>
      <SEO pageTitle="Services" />
      <div className="services-page-wrapper">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="svc-hero-section">
          <div className="svc-hero-bg"></div>
          <div className="svc-hero-smoke"></div>
          
          <div className="container" style={{ zIndex: 2 }}>
            <motion.div 
              className="svc-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 className="svc-hero-title" variants={fadeInUp}>
                <span>TRAIN.</span>
                <span>PERFORM.</span>
                <span>EVOLVE.</span>
              </motion.h1>
              
              <motion.p className="svc-hero-subtitle" variants={fadeInUp}>
                Professional dance training designed for every performer.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <Link to="/contact" className="svc-btn-glow">
                  BOOK A TRIAL
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. DETAILED SERVICES SECTION ================= */}
        <section className="svc-detailed-section">
          <div className="container">
            
            <div className="svc-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
              <div className="cyber-label" style={{ justifyContent: 'center' }}>OUR PROGRAMS</div>
              <h2 className="section-title">CORE SERVICES</h2>
            </div>

            <div className="svc-blocks-container">
              
              {/* Service 1 */}
              <motion.div 
                className="svc-block-row"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="svc-block-content">
                  <div className="svc-block-number">01</div>
                  <h3>HIP HOP & STREET FOUNDATIONS</h3>
                  <p>Master street foundations, grooves, and advanced textures in a high-energy environment. Perfect for beginners to advanced dancers looking to perfect their urban styles.</p>
                  <ul className="svc-feature-list">
                    <li><span>✦</span> Rhythm & Bounce Control</li>
                    <li><span>✦</span> Advanced Texture & Isolation</li>
                    <li><span>✦</span> Freestyle & Cypher Training</li>
                  </ul>
                  <Link to="/contact" className="svc-btn-glow" style={{ padding: '16px 32px', fontSize: '11px', marginTop: '10px' }}>EXPLORE PROGRAM</Link>
                </div>
                <div className="svc-block-visual">
                  <div className="svc-img-wrapper purple-glow">
                    <img src="/svc-hiphop.png" alt="Hip Hop Training at GDP Academy" />
                  </div>
                </div>
              </motion.div>

              {/* Service 2 */}
              <motion.div 
                className="svc-block-row reverse"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="svc-block-content">
                  <div className="svc-block-number">02</div>
                  <h3>STAGE PERFORMANCE & CHOREOGRAPHY</h3>
                  <p>Advanced training focused on camera awareness, stage blocking, and live audience impact. Learn complex routines and performance dynamics from elite mentors.</p>
                  <ul className="svc-feature-list">
                    <li><span>✦</span> Masterclass Choreography</li>
                    <li><span>✦</span> Stage Presence & Blocking</li>
                    <li><span>✦</span> Commercial Dance Prep</li>
                  </ul>
                  <Link to="/contact" className="svc-btn-glow" style={{ padding: '16px 32px', fontSize: '11px', marginTop: '10px' }}>EXPLORE PROGRAM</Link>
                </div>
                <div className="svc-block-visual">
                  <div className="svc-img-wrapper green-glow">
                    <img src="/svc-stage.png" alt="Stage Performance Training at GDP Academy" />
                  </div>
                </div>
              </motion.div>

              {/* Service 3 */}
              <motion.div 
                className="svc-block-row"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="svc-block-content">
                  <div className="svc-block-number">03</div>
                  <h3>KIDS & TEENS DEVELOPMENT</h3>
                  <p>A fun, disciplined structure for young dancers to develop coordination, musicality, and creative expression in a safe and supportive environment.</p>
                  <ul className="svc-feature-list">
                    <li><span>✦</span> Age-Appropriate Routines</li>
                    <li><span>✦</span> Confidence & Discipline Building</li>
                    <li><span>✦</span> Biannual Showcase Events</li>
                  </ul>
                  <Link to="/contact" className="svc-btn-glow" style={{ padding: '16px 32px', fontSize: '11px', marginTop: '10px' }}>EXPLORE PROGRAM</Link>
                </div>
                <div className="svc-block-visual">
                  <div className="svc-img-wrapper purple-glow">
                    <img src="/svc-kids.jpg" alt="Kids Dance Program at GDP Academy" />
                  </div>
                </div>
              </motion.div>

              {/* Service 4 */}
              <motion.div 
                className="svc-block-row reverse"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="svc-block-content">
                  <div className="svc-block-number">04</div>
                  <h3>WEDDING & PRIVATE COACHING</h3>
                  <p>Custom elegant and cinematic choreography to make your special moments unforgettable. One-on-one sessions tailored completely to your song and style.</p>
                  <ul className="svc-feature-list">
                    <li><span>✦</span> Custom Wedding First Dance</li>
                    <li><span>✦</span> Group Sangeet Choreography</li>
                    <li><span>✦</span> 1-on-1 Private Mentorship</li>
                  </ul>
                  <Link to="/contact" className="svc-btn-glow" style={{ padding: '16px 32px', fontSize: '11px', marginTop: '10px' }}>EXPLORE PROGRAM</Link>
                </div>
                <div className="svc-block-visual">
                  <div className="svc-img-wrapper green-glow">
                    <img src="/svc-wedding.jpg" alt="Wedding Choreography at GDP Academy" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= 3. EXPERIENCE STRIP ================= */}
        <section className="svc-stats-strip">
          <div className="container">
            <motion.div 
              className="svc-stats-flex"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">5000+</div>
                <div className="svc-stat-text">Students</div>
              </motion.div>
              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">100+</div>
                <div className="svc-stat-text">Performances</div>
              </motion.div>
              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">20+</div>
                <div className="svc-stat-text">Trainers</div>
              </motion.div>
              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">ALL</div>
                <div className="svc-stat-text">Age Groups</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= 4. WHY GDP SECTION ================= */}
        <section className="svc-why-gdp">
          <div className="container">
            <motion.h2 
              className="svc-why-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              WE BUILD PERFORMERS.
            </motion.h2>

            <motion.div 
              className="svc-why-blocks"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Creative Environment</div>
                <div className="svc-why-block-text">
                  Train in aesthetic, high-energy studios built to inspire freedom and individual expression.
                </div>
              </motion.div>
              
              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Real Stage Experience</div>
                <div className="svc-why-block-text">
                  Step beyond the studio. Our programs are engineered to prepare you for actual industry stages.
                </div>
              </motion.div>
              
              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Industry Mentorship</div>
                <div className="svc-why-block-text">
                  Learn directly from working professionals who bring real-world choreography and battle experience.
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= 5. FINAL CTA SECTION ================= */}
        <section className="svc-final-cta">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="svc-final-cta-title">
                START YOUR JOURNEY
              </h2>
              <Link to="/signup" className="svc-btn-glow">
                JOIN THE ACADEMY
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Services;

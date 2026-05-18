import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import '../styles/about.css';

const About: React.FC = () => {
  // Framer Motion Animation Presets
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
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <Layout>
      <SEO pageTitle="About Us" />

      <div className="about-page-wrapper">
        {/* Editorial Accent Grid Lines */}
        <div className="editorial-grid-line-y" style={{ left: '8%' }}></div>
        <div className="editorial-grid-line-y" style={{ right: '8%' }}></div>

        {/* Ambient Glowing Background Accents */}
        <div className="ambient-glow-purple" style={{ top: '15%', left: '10%' }}></div>
        <div className="ambient-glow-green" style={{ top: '45%', right: '8%' }}></div>
        <div className="ambient-glow-purple" style={{ bottom: '15%', left: '15%' }}></div>

        {/* ================= 1. HERO SECTION ================= */}
        <section className="hero-futuristic">
          <div className="vertical-side-text">
            MORE THAN DANCE — A <span>MOVEMENT</span>
          </div>

          {/* Huge Backdrop Typography */}
          <div className="hero-giant-bg-text">
            <div className="giant-text-row outlined">DANCE</div>
            <div className="giant-text-row">GDP</div>
            <div className="giant-text-row accented">ACADEMY</div>
          </div>

          <div className="container">
            <div className="hero-content-inner">

              {/* Left Side: Copy and Intro */}
              <motion.div
                className="hero-text-details"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="cyber-label">SYSTEM INITIATIVE</div>
                <h1 style={{ marginBottom: '15px' }}>
                  ABOUT <span className="green-glow">GDP</span>
                </h1>
                <p style={{
                  fontFamily: 'var(--font-krona)',
                  fontSize: '14px',
                  color: 'var(--theme-green)',
                  letterSpacing: '1px',
                  marginBottom: '25px',
                  textTransform: 'uppercase'
                }}>
                  More Than Dance — A Movement.
                </p>
                <p className="lead-desc" style={{ fontSize: '17px', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.85)' }}>
                  GDP Dance Academy is a creative space where passion, performance, and personality come together. We train dancers with confidence, discipline, and real stage experience.
                </p>
                <div className="futuristic-cta-wrapper" style={{ marginTop: '35px' }}>
                  <Link to="/signup" className="glow-btn-primary">
                    Join The Academy
                  </Link>
                </div>
              </motion.div>

              {/* Right Side: Hero Dancer Cutout */}
              <div className="hero-visual-centerpiece">
                <div className="cyber-circle-glow"></div>

                <motion.img
                  src="/anubhav.png"
                  alt="Anubhav Dancer Cutout"
                  className="main-dancer-cutout"
                  initial={{ opacity: 0, scale: 0.9, y: 60 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Floating tags */}
                <motion.div
                  className="mini-card card-est float-slow"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="mini-card-title">SYSTEM</div>
                  <div className="mini-card-text">HIGH ENERGY v2.0</div>
                </motion.div>

                <motion.div
                  className="mini-card card-culture float-reverse"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <div className="mini-card-title">STYLE DEFINITION</div>
                  <div className="mini-card-text">DANCE POSTER VIBE</div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 1.5 PREMIUM LAPTOP EXPERIENCE SECTION ================= */}
        <section className="laptop-experience-section">
          {/* Cinematic Background Elements */}
          <div className="laptop-bg-grid"></div>
          <div className="laptop-bg-particles"></div>
          <div className="laptop-ambient-backlight"></div>

          <div className="container">
            <div className="laptop-exp-container">
              
              {/* Left Content */}
              <motion.div 
                className="laptop-exp-content"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="laptop-exp-label">THE GDP EXPERIENCE</div>
                <h2 className="laptop-exp-title">
                  NOT YOUR<br/>AVERAGE<br/><span className="grad-text">DANCE ACADEMY</span>
                </h2>
                <p className="laptop-exp-desc">
                  GDP combines choreography, performance training, and creative learning into one modern dance experience designed for passionate performers.
                </p>

                <div className="laptop-exp-features">
                  <div className="premium-feature-card">
                    <div className="feature-glow-border"></div>
                    <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></i>
                    <span>Performance Training</span>
                  </div>
                  <div className="premium-feature-card">
                    <div className="feature-glow-border"></div>
                    <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></i>
                    <span>Loop Practice</span>
                  </div>
                  <div className="premium-feature-card">
                    <div className="feature-glow-border"></div>
                    <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg></i>
                    <span>Stage Experience</span>
                  </div>
                  <div className="premium-feature-card">
                    <div className="feature-glow-border"></div>
                    <i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></i>
                    <span>Creative Community</span>
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <Link to="/services" className="glow-btn-primary laptop-btn">
                    EXPLORE CLASSES
                  </Link>
                </div>
              </motion.div>

              {/* Right Visual Composition - Laptop Only */}
              <motion.div 
                className="laptop-exp-visual float-slow"
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                
                <div className="laptop-mockups-wrapper">
                  
                  {/* Laptop Setup */}
                  <div className="laptop-3d-frame">
                    <img src="/laptop.png" alt="GDP Experience on Laptop" className="laptop-mockup-img" />
                    
                    <div className="laptop-screen-content cinematic-overlay">
                      <iframe 
                        src="https://www.youtube.com/embed/n_AHV1XwP9w?autoplay=1&mute=1&loop=1&playlist=n_AHV1XwP9w&controls=0&showinfo=0&rel=0&modestbranding=1"
                        className="laptop-video-embed"
                        title="GDP Experience"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ border: 'none', pointerEvents: 'none' }}
                      ></iframe>
                      <div className="screen-reflection"></div>
                    </div>
                  </div>
                  
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= 2. QUICK INFO SECTION ================= */}
        <section className="quick-info section-padding" style={{ position: 'relative', zIndex: 10 }}>
          <div className="container">
            <motion.div
              className="premium-stats-band"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >

              {/* Stat 1 */}
              <motion.div className="premium-stat-item" variants={scaleUp}>
                <span className="premium-stat-number">5000+</span>
                <span className="premium-stat-label">Students Trained</span>
                <div className="premium-stat-glow"></div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div className="premium-stat-item" variants={scaleUp}>
                <span className="premium-stat-number">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"></path></svg>
                </span>
                <span className="premium-stat-label">Professional Mentors</span>
                <div className="premium-stat-glow"></div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div className="premium-stat-item" variants={scaleUp}>
                <span className="premium-stat-number">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                </span>
                <span className="premium-stat-label">Stage Performances</span>
                <div className="premium-stat-glow"></div>
              </motion.div>

              {/* Stat 4 */}
              <motion.div className="premium-stat-item" variants={scaleUp}>
                <span className="premium-stat-number">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
                <span className="premium-stat-label">All Age Groups</span>
                <div className="premium-stat-glow"></div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ================= 3. OUR STORY SECTION ================= */}
        <section className="who-we-are section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Giant background quote mark */}
          <div className="giant-quote-mark">"</div>

          <div className="container">
            <motion.div
              className="premium-story-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="cyber-label" style={{ marginBottom: '40px' }}>THE LEGACY</div>
              <h2 className="premium-story-text">
                GDP started with one vision — to build a dance community where talent grows beyond limits. From beginners to performers, we focus on <span className="text-highlight-green">creativity</span>, <span className="text-highlight-purple">confidence</span>, <span className="text-highlight-green">discipline</span>, and real artistic expression.
              </h2>
            </motion.div>
          </div>
        </section>

        {/* ================= 4. WHY GDP SECTION ================= */}
        <section className="why-choose-us section-padding">
          <div className="container">
            <div className="premium-section-header">
              <div className="cyber-label">SYSTEM METRICS</div>
              <h2 className="section-title">WHY GDP</h2>
            </div>

            <motion.div
              className="premium-features-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >

              {/* Feature 1 */}
              <motion.div className="premium-feature-card" variants={fadeInUp}>
                <div className="feature-bg-number">01</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div className="feature-content">
                  <h3>Performance Training</h3>
                  <p>Build high-energy camera presence and technical body control designed strictly for modern stages and visual productions.</p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div className="premium-feature-card" variants={fadeInUp} style={{ marginTop: '40px' }}>
                <div className="feature-bg-number">02</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </div>
                <div className="feature-content">
                  <h3>Choreography Sessions</h3>
                  <p>Master unique routines that blend styling textures, dynamic speeds, and premium rhythm patterns from master mentors.</p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div className="premium-feature-card" variants={fadeInUp}>
                <div className="feature-bg-number">03</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"></path></svg>
                </div>
                <div className="feature-content">
                  <h3>Dance Battles & Events</h3>
                  <p>Claim your spotlight in weekly showcase nights, street battles, ciphers, and collaborative community events.</p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div className="premium-feature-card" variants={fadeInUp} style={{ marginTop: '40px' }}>
                <div className="feature-bg-number">04</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                </div>
                <div className="feature-content">
                  <h3>Personal Growth</h3>
                  <p>We focus on personal identity and mental confidence, turning passion into absolute self-discipline.</p>
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div className="premium-feature-card" variants={fadeInUp}>
                <div className="feature-bg-number">05</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div className="feature-content">
                  <h3>Team Culture</h3>
                  <p>Be part of a raw, supportive family of high-energy creators. Learn, battle, and grow alongside peers who inspire you.</p>
                </div>
              </motion.div>

              {/* Feature 6 */}
              <motion.div className="premium-feature-card" variants={fadeInUp} style={{ marginTop: '40px' }}>
                <div className="feature-bg-number">06</div>
                <div className="premium-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.46 2 12 2z"></path></svg>
                </div>
                <div className="feature-content">
                  <h3>Creative Environment</h3>
                  <p>An artistic space fitted with top aesthetics, allowing complete freedom to express individual style and energy.</p>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ================= 5. FINAL CTA SECTION ================= */}
        <section className="final-cta-section section-padding" style={{ position: 'relative' }}>
          <div className="cta-glow-bg"></div>

          <div className="container">
            <motion.div
              className="premium-cta-content"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="premium-cta-title">
                READY TO MOVE?
              </h2>
              <p className="premium-cta-desc">
                Join the next generation of performers with GDP Dance Academy.
              </p>
              <div style={{ marginTop: '50px' }}>
                <Link to="/signup" className="glow-btn-primary" style={{ padding: '24px 50px', fontSize: '14px' }}>
                  Start Your Journey
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default About;

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

              {/* Right Visual - Futuristic Holographic Showcase */}
              <motion.div 
                className="hologram-exp-visual float-slow"
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hologram-showcase-wrapper">
                  {/* Ambient Glows */}
                  <div className="hologram-glow hologram-glow-purple"></div>
                  <div className="hologram-glow hologram-glow-green"></div>

                  {/* Corner Target Markers (Futuristic Tech Aesthetic) */}
                  <div className="hologram-corner corner-tl"></div>
                  <div className="hologram-corner corner-tr"></div>
                  <div className="hologram-corner corner-bl"></div>
                  <div className="hologram-corner corner-br"></div>

                  {/* Main Holographic Glass Viewport */}
                  <div className="hologram-viewport">
                    <video
                      src="/hero.mp4"
                      autoPlay muted loop playsInline
                      className="hologram-video"
                    />
                    
                    {/* Futuristic Scanning Laser Line */}
                    <div className="hologram-scanner-line"></div>
                    
                    {/* Glass Glare Reflection */}
                    <div className="hologram-glare"></div>
                    
                    {/* Soundwave HUD Graphic at Bottom */}
                    <div className="hologram-soundwave">
                      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                  </div>

                  {/* Interactive Floating Glass Badges */}
                  <div className="hologram-badge badge-top-left">
                    <span className="pulse-dot"></span>
                    <span className="badge-text">GDP LIVE FEED</span>
                  </div>
                  
                  <div className="hologram-badge badge-top-right">
                    <span className="badge-tech-label">CORE SYSTEM v4.2</span>
                  </div>

                  <div className="hologram-badge badge-bottom-left">
                    <span className="badge-gradient-text">CREATIVE LOOP ACTIVE</span>
                  </div>

                  <div className="hologram-badge badge-bottom-right">
                    <span className="badge-text">120 FPS // 4K</span>
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

        {/* ================= 3. CORE PILLARS SECTION ================= */}
        <section className="about-pillars-section">
          <div className="container">
            <div className="premium-section-header">
              <div className="cyber-label">THE FOUNDATION</div>
              <h2 className="section-title">CORE PILLARS</h2>
            </div>

            <motion.div 
              className="about-pillars-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {/* Pillar 1 */}
              <motion.div className="pillar-card" variants={fadeInUp}>
                <span className="pillar-num">PILLAR 01</span>
                <h3>Choreography & Style</h3>
                <p>
                  Master unique textures, dynamic timing, and rhythmic pacing. Our training bridges stylistic street vibes with technical contemporary performance to build your individual dance signature.
                </p>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div className="pillar-card" variants={fadeInUp}>
                <span className="pillar-num">PILLAR 02</span>
                <h3>Stage Presence</h3>
                <p>
                  We build camera presence, spatial intelligence, and battle-ready confidence. Performers learn the psychology of movement projection to command spotlights and capture live audiences.
                </p>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div className="pillar-card" variants={fadeInUp}>
                <span className="pillar-num">PILLAR 03</span>
                <h3>Dynamic Groove</h3>
                <p>
                  Elevate your musicality and physical syncopation. We teach precision beat-isolation and body control designed strictly for modern choreography paces and commercial speed dynamics.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= 4. DANCE CHRONICLES TIMELINE ================= */}
        <section className="about-timeline-section">
          <div className="container">
            <div className="premium-section-header">
              <div className="cyber-label">OUR PATHWAY</div>
              <h2 className="section-title">THE CHRONICLES</h2>
            </div>

            <div className="timeline-pipeline-wrapper">
              {/* Horizontal Progress Pipeline Conduit */}
              <div className="pipeline-conduit"></div>

              <div className="pipeline-grid">
                {/* Year 2020 */}
                <div className="pipeline-item">
                  <div className="pipeline-node"></div>
                  <div className="pipeline-card">
                    <span className="pipeline-year">2020</span>
                    <h3>The Core Vision</h3>
                    <p>
                      GDP was founded by passionate master instructors with a single mission: to redefine street and commercial choreography training, moving away from average steps toward elite artistic expression.
                    </p>
                  </div>
                </div>

                {/* Year 2022 */}
                <div className="pipeline-item">
                  <div className="pipeline-node"></div>
                  <div className="pipeline-card">
                    <span className="pipeline-year">2022</span>
                    <h3>Cinematic Portfolios</h3>
                    <p>
                      Introduced professional cinematic video production into the core curriculum, allowing students to record high-fidelity showcase ciphers and build premium visual performance reels.
                    </p>
                  </div>
                </div>

                {/* Year 2024 */}
                <div className="pipeline-item">
                  <div className="pipeline-node"></div>
                  <div className="pipeline-card">
                    <span className="pipeline-year">2024</span>
                    <h3>Studio Expansion</h3>
                    <p>
                      Built a fully acoustic-treated, flagship studio hub complete with professional shock-absorbing flooring, multi-cam shooting rigs, and smart dynamic RGB mood matrices.
                    </p>
                  </div>
                </div>

                {/* Year 2026 */}
                <div className="pipeline-item">
                  <div className="pipeline-node"></div>
                  <div className="pipeline-card">
                    <span className="pipeline-year">2026</span>
                    <h3>National Standard</h3>
                    <p>
                      With 5000+ students trained and weekly battle cipher coves established, GDP stands as the national vanguard for high-energy dance education and professional performer portfolios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. STUDIO ECOSYSTEM SECTION ================= */}
        <section className="about-ecosystem-section">
          <div className="container">
            <div className="premium-section-header">
              <div className="cyber-label">THE INFRASTRUCTURE</div>
              <h2 className="section-title">STUDIO ECOSYSTEM</h2>
            </div>

            <div className="ecosystem-grid">
              {/* Feature 1 */}
              <div className="ecosystem-card">
                <div className="ecosystem-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 2 18 2 18 6 6 6 6 2"></polygon><rect x="3" y="6" width="18" height="16" rx="2"></rect></svg>
                </div>
                <div className="ecosystem-info">
                  <h3>Shock-Absorbing Dance Floors</h3>
                  <p>
                    Custom engineered floating wooden dance floors lined with multi-layer high-density shock absorbers to prevent joint injury and optimize footwork impact dynamics.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="ecosystem-card">
                <div className="ecosystem-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"></path></svg>
                </div>
                <div className="ecosystem-info">
                  <h3>Visual Production Suite</h3>
                  <p>
                    In-house professional multi-cam setup, motorized stabilizer rigs, and premium lighting systems designed to film and compile high-definition student choreo reels.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="ecosystem-card">
                <div className="ecosystem-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                </div>
                <div className="ecosystem-info">
                  <h3>High-Fidelity Bass Acoustics</h3>
                  <p>
                    Flagship-level audio distribution and acoustic panelling tuned strictly to capture low-frequency rhythmic beats, helping students feel and track micro-grooves.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="ecosystem-card">
                <div className="ecosystem-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                </div>
                <div className="ecosystem-info">
                  <h3>RGB Dynamic Neon Grid</h3>
                  <p>
                    State-of-the-art smart LED arrays that synchronize ambient light presets to choreo tempos and styles, amplifying dance video loops visually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. FINAL CTA SECTION ================= */}
        <section className="final-cta-section">
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
                READY TO CHOOSE YOUR GROOVE?
              </h2>
              <p className="premium-cta-desc">
                Join the next generation of performers. Experience premium training, cinematic ciphers, and a raw support family.
              </p>
              <div style={{ marginTop: '40px' }}>
                <Link to="/contact" className="glow-btn-primary" style={{ padding: '20px 45px', fontSize: '13px', display: 'inline-block' }}>
                  START YOUR EXPERIENCE
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

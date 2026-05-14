import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import LazyVideo from '../components/common/LazyVideo';
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <Layout>
      <section className="about-content section-padding" style={{ paddingTop: '160px' }}>
        <div className="container">
          <div className="about-grid">
            <motion.div 
              className="about-image-wrapper"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
               <div className="about-img-main">
                 <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80" alt="Studio" />
               </div>
            </motion.div>
            
            <motion.div 
              className="about-text-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="gradient-text">GDP ACADEMY</h2>
              <p>
                Founded on the principle that dance is the ultimate expression of human potential, 
                GDP Academy represents the pinnacle of artistic training. Our cinematic facilities 
                provide an immersive environment where technical mastery meets pure artistic freedom.
              </p>
              <p>
                We don't just teach steps; we cultivate artists. Our world-renowned Dance Coaches 
                bring decades of global stage experience to every session, ensuring that every 
                student—from beginner to pro—unlocks their true vibrance.
              </p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <h3>150+</h3>
                  <p>Global Artists</p>
                </div>
                <div className="stat-item">
                  <h3>12+</h3>
                  <p>Elite Programs</p>
                </div>
                <div className="stat-item">
                  <h3>24/7</h3>
                  <p>Digital Access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="philosophy-section">
        <div className="container">
          <div className="section-header-v2" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title-v2">OUR CORE <span className="gradient-text">PHILOSOPHY</span></h2>
          </div>
          
          <div className="philosophy-grid">
            {[
              { 
                icon: '🎯', 
                title: 'PRECISION', 
                text: 'Uncompromising technical excellence in every movement, guided by elite global mentors.' 
              },
              { 
                icon: '🎨', 
                title: 'ARTISTRY', 
                text: 'Cultivating the unique voice of every performer through creative exploration and freedom.' 
              },
              { 
                icon: '⚡', 
                title: 'VIBRANCY', 
                text: 'A high-energy, supportive network of artists pushing the boundaries of what is possible.' 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="philosophy-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mission-section section-padding">
        <div className="container">
          <div className="mission-grid">
            <motion.div 
              className="mission-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3>OUR MISSION</h3>
              <p>To bridge the gap between passion and profession, providing a global platform where every dancer can discover their unique rhythm and master their craft with world-class guidance.</p>
            </motion.div>
            <motion.div 
              className="mission-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>OUR VISION</h3>
              <p>To become the world's most influential dance ecosystem, fostering a culture of technical perfection, creative freedom, and lifelong artistic growth.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;


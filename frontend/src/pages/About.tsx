import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <Layout>
      <section className="about-hero">
        <div className="container">
          <h1 className="section-title">THE <span className="gradient-text">LEGACY</span></h1>
          <p className="hero-subtitle">Defining the future of movement through excellence, passion, and innovation.</p>
        </div>
      </section>

      <section className="about-content section-padding">
        <div className="container">
          <div className="about-grid">
            <div className="about-image reveal">
               <img src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80" alt="Studio" />
            </div>
            <div className="about-text">
              <h2 className="gradient-text">GDP ACADEMY</h2>
              <p>
                GDP Academy was founded on the principle that dance is the ultimate expression of human potential. 
                Our cinematic facilities and world-renowned Dance Coaches provide an immersive environment where technical mastery 
                meets artistic freedom.
              </p>
              <p>
                Whether you are a beginner taking your first steps or a professional refining your craft, our tailored 
                Dance Programs are designed to push your boundaries and unlock your full potential.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <h4>GLOBAL NETWORK</h4>
                  <p>Join a world-class community of artists from over 150 countries.</p>
                </div>
                <div className="feature-item">
                  <h4>ELITE STUDIOS</h4>
                  <p>Train in state-of-the-art facilities equipped with professional flooring and sound.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values section-padding">
        <div className="container">
          <div className="section-header">
            <h2>OUR CORE <span className="gradient-text">PHILOSOPHY</span></h2>
          </div>
          <div className="values-grid">
            <div className="value-card glass-card reveal">
              <h3>PRECISION</h3>
              <p>Uncompromising technical excellence in every movement, guided by elite Dance Coaches.</p>
            </div>
            <div className="value-card glass-card reveal">
              <h3>ARTISTRY</h3>
              <p>Cultivating the unique voice of every performer through creative exploration and freedom.</p>
            </div>
            <div className="value-card glass-card reveal">
              <h3>VIBRANCY</h3>
              <p>A high-energy, supportive network of artists pushing the boundaries of what's possible.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;


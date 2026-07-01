import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '250K+', label: 'Social Community' },
  { value: '15+', label: 'Years of Experience' },
  { value: '700+', label: 'Weddings Choreographed' },
  { value: '50K+', label: 'Students Trained' },
];

const REASONS = [
  {
    num: '01',
    title: 'Wedding & Event Experts',
    text: 'Sangeet, couple entries & family performances — choreographed with patience for every comfort level.',
  },
  {
    num: '02',
    title: 'Studio + Zoom Classes',
    text: 'Train in Ghaziabad or join live online sessions from home with the same energy and personal attention.',
  },
  {
    num: '03',
    title: 'Every Style, Every Level',
    text: 'Bollywood, Kathak, Hip Hop & fusion — structured programs for beginners, enthusiasts & performers.',
  },
  {
    num: '04',
    title: 'Confidence On Stage',
    text: 'Beyond steps — build timing, expression & stage presence that shines at weddings, events & showcases.',
  },
];

const WhyChooseGDPSection: React.FC = () => {
  return (
    <section className="why-gdp-section section-padding">
      <div className="container">
        <div className="services-section-header">
          <h2 className="section-title">
            Why Choose <span className="gradient-text">GDP</span>
          </h2>
          <p className="section-desc">
            Garima Dance Productions — where expert choreography meets celebration, online and offline.
          </p>
        </div>

        <motion.div
          className="why-gdp-stats-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="why-gdp-stat-col">
              <div className="why-gdp-stat-value">{stat.value}</div>
              <div className="why-gdp-stat-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="why-gdp-grid">
          {REASONS.map((item, index) => (
            <motion.article
              key={item.num}
              className="why-gdp-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <span className="why-gdp-card-num">{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseGDPSection;

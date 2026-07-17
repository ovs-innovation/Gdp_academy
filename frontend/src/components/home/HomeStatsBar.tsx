import React from 'react';
import { motion } from 'framer-motion';

const DEFAULT_STATS = [
  { value: '250K+', label: 'Social Community' },
  { value: '15+', label: 'Years of Experience' },
  { value: '700+', label: 'Weddings Choreographed' },
  { value: '50K+', label: 'Students Trained' },
];

type StatItem = { value: string; label: string };

interface HomeStatsBarProps {
  stats?: StatItem[];
}

/** Compact stats strip — sits just above Services on the homepage. */
const HomeStatsBar: React.FC<HomeStatsBarProps> = ({ stats }) => {
  const items =
    stats?.length && stats.every((s) => s.value && s.label) ? stats : DEFAULT_STATS;

  return (
    <section className="home-stats-section">
      <div className="container">
        <motion.div
          className="home-stats-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {items.map((stat) => (
            <div key={stat.label} className="home-stats-col">
              <div className="home-stats-value">{stat.value}</div>
              <div className="home-stats-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeStatsBar;

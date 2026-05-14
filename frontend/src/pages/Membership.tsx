import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import '../styles/membership.css';

const Membership: React.FC = () => {
  const plans = [
    { name: 'Basic Member', price: '$49', period: 'month', features: ['2 Dance Styles', 'Live Zoom Sessions', 'Community Access', 'Digital Certificate'], recommended: false },
    { name: 'Elite Artist', price: '$99', period: 'month', features: ['All Dance Styles', 'Recorded Library Access', '1-on-1 Coach Feedback', 'Performance Opportunities', 'Priority Support'], recommended: true },
    { name: 'Academy Pro', price: '$899', period: 'year', features: ['Lifetime Access', 'VIP Workshop Invites', 'Custom Training Plan', 'Studio Rentals Discount', 'Personal Brand Coaching'], recommended: false },
  ];

  return (
    <Layout>
      <section className="membership-hero">
        <div className="container">
          <h1 className="section-title">CHOOSE YOUR <span className="gradient-text">MEMBERSHIP</span></h1>
          <p className="hero-subtitle">Elevate your craft with flexible plans designed for every stage of your dance journey.</p>
        </div>
      </section>

      <section className="pricing section-padding">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`pricing-card glass-card ${plan.recommended ? 'recommended' : ''}`}
              >
                {plan.recommended && <div className="recommended-badge">BEST VALUE</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <div className="divider"></div>
                <ul className="features-list">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={`primary-btn join-btn ${plan.recommended ? '' : 'glass-btn'}`} style={{ width: '100%' }}>
                  START MEMBERSHIP
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Membership;


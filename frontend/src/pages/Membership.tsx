import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { getMembershipPlans } from '../services/cmsService';
import { usePageContent, renderSplitHeroTitle } from '../hooks/usePageContent';
import '../styles/membership.css';

const DEFAULT_PLANS = [
  { name: 'Starter Passion Plan', price: '$29', period: 'month', features: ['Access to 2 Live Zoom classes per month', 'Beginner choreography video library access', 'Community forum discussion access', 'Standard email support'], recommended: false },
  { name: 'Pro Performer Plan', price: '$59', period: 'month', features: ['Access to 8 Live Zoom classes per month', 'Full access to entire pre-recorded library', 'Interactive feedback from choreographers', '10% discount on special workshops', 'Priority support response'], recommended: true },
  { name: 'Elite Master Plan', price: '$99', period: 'month', features: ['Unlimited access to all Live Zoom sessions', 'Unlimited access to video library & masterclasses', 'Monthly 1-on-1 personalized review', 'Free entry to all seasonal workshops', 'Certificate of completion & VIP support'], recommended: false },
];

const Membership: React.FC = () => {
  const { content, loaded } = usePageContent('membership');
  const hero = renderSplitHeroTitle(content, { before: 'CHOOSE YOUR ', highlight: 'MEMBERSHIP' });
  const heroSubtitle =
    (content.heroSubtitle as string) ||
    'Elevate your craft with flexible plans designed for every stage of your dance journey.';
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    getMembershipPlans()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((plan: any) => ({
            name: plan.title,
            price: `${plan.currency === 'USD' ? '$' : plan.currency + ' '}${plan.price}`,
            period: plan.durationUnit || 'month',
            features: plan.features || [],
            recommended: plan.title.toLowerCase().includes('pro') || plan.title.toLowerCase().includes('elite') || plan.title.toLowerCase().includes('performer')
          }));
          setPlans(mapped);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      })
      .catch(() => {
        setPlans(DEFAULT_PLANS);
      });
  }, []);

  return (
    <Layout>
      <SEO
        pageTitle="Membership Plans"
        description="Choose a GDP membership plan for live Zoom classes, recorded library access, workshops, and priority support."
        path="/membership"
      />
      <section className="membership-hero">
        <div className="container">
          {!loaded ? (
            <>
              <div className="home-skel" style={{ height: 40, width: 320, margin: '0 auto 16px' }} />
              <div className="home-skel" style={{ height: 16, width: '70%', maxWidth: 480, margin: '0 auto' }} />
            </>
          ) : (
            <>
              <h1 className="section-title">{hero.before}<span className="gradient-text">{hero.highlight}</span></h1>
              <p className="hero-subtitle">{heroSubtitle}</p>
            </>
          )}
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
                  {plan.features.map((f: string) => <li key={f}>{f}</li>)}
                </ul>
                <Link
                  to={`/contact?source=membership&plan=${encodeURIComponent(plan.name)}`}
                  className={`primary-btn join-btn ${plan.recommended ? '' : 'glass-btn'}`}
                  style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  START MEMBERSHIP
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Membership;

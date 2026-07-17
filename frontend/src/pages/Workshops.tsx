import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { fetchWorkshops } from '../services/programService';
import WorkshopCard, { defaultWorkshops } from '../components/workshops/WorkshopCard';
import { usePageContent, renderSplitHeroTitle } from '../hooks/usePageContent';
import SEO from '../components/SEO';
import '../styles/workshops.css';

const Workshops: React.FC = () => {
  const { content, loaded } = usePageContent('workshops');
  const hero = renderSplitHeroTitle(content, { before: 'MASTER ', highlight: 'WORKSHOPS' });
  const heroSubtitle =
    (content.heroSubtitle as string) ||
    'Intensive training sessions led by world-renowned dance masters.';
  const [workshopsList, setWorkshopsList] = useState(defaultWorkshops);

  useEffect(() => {
    fetchWorkshops({ status: 'active' })
      .then((data: any) => {
        const list = data.Programs || data.courses || data.programs || [];
        if (list && list.length > 0) {
          setWorkshopsList(list);
        }
      })
      .catch((err) => console.error('Error loading workshops:', err));
  }, []);

  return (
    <Layout>
      <SEO
        pageTitle="Dance Workshops"
        description="Join intensive dance workshops at Garima Dance Productions — masterclasses with expert choreographers."
        path="/workshops"
      />
      <section className="workshops-hero section-padding">
        <div className="container">
          {!loaded ? (
            <>
              <div className="home-skel" style={{ height: 40, width: 300, margin: '0 auto 16px' }} />
              <div className="home-skel" style={{ height: 16, width: '65%', maxWidth: 420, margin: '0 auto' }} />
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-title"
              >
                {hero.before}<span className="gradient-text">{hero.highlight}</span>
              </motion.h1>
              <p className="hero-subtitle">{heroSubtitle}</p>
            </>
          )}
        </div>
      </section>

      <section className="workshops-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="workshops-list">
            {workshopsList.map((workshop, i) => (
              <WorkshopCard key={workshop._id || workshop.id || i} workshop={workshop} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Workshops;

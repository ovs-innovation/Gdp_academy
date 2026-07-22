import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { fetchWorkshops } from '../services/programService';
import WorkshopCard, { defaultWorkshops } from '../components/workshops/WorkshopCard';
import WorkshopsLanding from '../components/workshops/WorkshopsLanding';
import { usePageContent } from '../hooks/usePageContent';
import { normalizeWorkshopsPageContent } from '../lib/workshopsPageCms';
import SEO from '../components/SEO';
import '../styles/workshops.css';

const Workshops: React.FC = () => {
  const { content } = usePageContent('workshops');
  const page = normalizeWorkshopsPageContent(content as Record<string, unknown>);
  const [workshopsList, setWorkshopsList] = useState(defaultWorkshops);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops({ status: 'active' })
      .then((data: any) => {
        const list = data.Programs || data.courses || data.programs || [];
        if (list?.length > 0) setWorkshopsList(list);
      })
      .catch((err) => console.error('Error loading workshops:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <SEO
        pageTitle="Dance Workshops"
        description={page.featuredDescription || 'Join intensive dance workshops at Garima Dance Productions.'}
        path="/workshops"
      />

      <WorkshopsLanding content={page} />

      <section id="workshop-list" className="wsh-list-section section-padding">
        <div className="container">
          <header className="wsh-list-header">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              {page.listSectionTitle}{' '}
              <span className="gradient-text">{page.listSectionHighlight}</span>
            </motion.h2>
            <p className="section-desc">{page.listSectionSubtitle}</p>
          </header>

          {loading && <div className="wsh-list-status">Loading workshops...</div>}

          <div className="wsh-list-grid">
            {workshopsList.map((workshop, i) => (
              <WorkshopCard
                key={workshop._id || workshop.id || i}
                workshop={workshop}
                index={i}
              />
            ))}
          </div>

          {!loading && workshopsList.length === 0 && (
            <div className="wsh-list-empty">
              <h3>No workshops scheduled right now</h3>
              <p>Contact us to know about the next live session.</p>
              <Link to="/contact?source=workshop" className="primary-btn">
                Contact GDP Studio
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Workshops;

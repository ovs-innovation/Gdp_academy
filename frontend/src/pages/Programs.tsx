import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchPrograms, type Program } from '../services/programService';
import { usePageContent, renderMultiLineHeroTitle } from '../hooks/usePageContent';
import SEO from '../components/SEO';
import ShareActions from '../components/common/ShareActions';
import '../styles/programs.css';

const fallbackPrograms: Program[] = [
  {
    _id: 'bollywood-dance',
    name: 'Bollywood Dance',
    description: 'High-energy choreography, expressions, stage presence, and performance-ready routines.',
    danceStyle: 'Bollywood',
    category: 'Bollywood',
    level: 'all_levels',
    duration: 12,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85',
    price: 2999,
    discountPrice: 2499,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'bollywood-dance',
  },
  {
    _id: 'hip-hop',
    name: 'Hip Hop',
    description: 'Grooves, footwork, freestyle foundations, musicality, and bold urban performance style.',
    danceStyle: 'Hip Hop',
    category: 'Hip Hop',
    level: 'beginner',
    duration: 8,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=1200&q=85',
    price: 2499,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'hip-hop',
  },
  {
    _id: 'contemporary',
    name: 'Contemporary',
    description: 'Fluid movement, floorwork, balance, control, and emotive choreography for growing dancers.',
    danceStyle: 'Contemporary',
    category: 'Contemporary',
    level: 'intermediate',
    duration: 10,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=85',
    price: 3499,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'contemporary',
  },
  {
    _id: 'kids-dance',
    name: 'Kids Dance',
    description: 'Fun movement sessions for kids with rhythm, confidence, coordination, and stage basics.',
    danceStyle: 'Kids',
    category: 'Kids',
    level: 'beginner',
    duration: 6,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=85',
    price: 1999,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'kids-dance',
  },
  {
    _id: 'salsa',
    name: 'Salsa',
    description: 'Partner basics, turns, timing, body rhythm, and social dance combinations.',
    danceStyle: 'Salsa',
    category: 'Latin',
    level: 'all_levels',
    duration: 8,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&w=1200&q=85',
    price: 2999,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'salsa',
  },
  {
    _id: 'wedding-choreography',
    name: 'Wedding Choreography',
    description: 'Custom family, couple, and group routines designed for unforgettable wedding performances.',
    danceStyle: 'Wedding',
    category: 'Wedding',
    level: 'all_levels',
    duration: 4,
    durationUnit: 'weeks',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
    price: 4999,
    currency: 'INR',
    status: 'active',
    type: 'program',
    slug: 'wedding-choreography',
  },
];

const imageFallback = 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&w=1200&q=85';

const getText = (value?: string | { en?: string; [key: string]: string }) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.en || Object.values(value)[0] || '';
};

const formatLevel = (level?: Program['level']) => {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    all_levels: 'All Levels',
  };
  return level ? labels[level] : 'All Levels';
};

const formatPrice = (program: Program) => {
  const price = program.discountPrice || program.price || 0;
  if (!price) return 'Free Trial';
  const currency = program.currency || 'INR';
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

const Programs: React.FC = () => {
  const { content: pageContent } = usePageContent('programs');
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const heroLines = renderMultiLineHeroTitle(pageContent, ['LEARN.', 'PERFORM.', 'EVOLVE.']);
  const heroBadge = (pageContent.heroBadge as string) || 'GDP STUDIO PROGRAMS';
  const heroSubtitle =
    (pageContent.heroSubtitle as string) ||
    'Structured dance programs for studio, stage, and celebration — Bollywood, Hip Hop, Contemporary, Kids, Salsa, and custom wedding choreography.';
  const ctaPrimary = (pageContent.ctaText as string) || 'Explore Programs';
  const ctaPrimaryUrl = (pageContent.ctaUrl as string) || '#program-list';
  const ctaSecondary = (pageContent.ctaSecondaryText as string) || 'Get Guidance';
  const ctaSecondaryUrl = (pageContent.ctaSecondaryUrl as string) || '/contact';
  const [activeStyle, setActiveStyle] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPrograms = async () => {
      try {
        const response = await fetchPrograms({ status: 'active' });
        const livePrograms = response.programs || response.Programs || [];
        if (mounted && livePrograms.length > 0) {
          setPrograms(livePrograms.filter((program) => (program.type || 'program') === 'program'));
        }
      } catch (error) {
        if (mounted) setPrograms(fallbackPrograms);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPrograms();
    return () => {
      mounted = false;
    };
  }, []);

  const danceStyles = useMemo(() => {
    const styles = programs
      .map((program) => program.danceStyle || program.DanceStyle || program.category || 'General')
      .filter(Boolean);
    return ['All', ...Array.from(new Set(styles))];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return programs.filter((program) => {
      const title = getText(program.name).toLowerCase();
      const description = getText(program.description).toLowerCase();
      const style = (program.danceStyle || program.DanceStyle || program.category || 'General').toLowerCase();
      const matchesStyle = activeStyle === 'All' || style === activeStyle.toLowerCase();
      const matchesSearch = !query || title.includes(query) || description.includes(query) || style.includes(query);
      return matchesStyle && matchesSearch;
    });
  }, [activeStyle, programs, search]);

  return (
    <Layout>
      <SEO
        pageTitle="Dance Programs"
        description="Browse category-wise dance programs at Garima Dance Productions — Bollywood, classical, contemporary, and more."
        path="/programs"
      />
      <section className="prog-hero-section">
        <div className="prog-hero-bg"></div>
        <div className="prog-hero-smoke"></div>
        <div className="prog-hero-grid-overlay"></div>

        <div className="container prog-hero-container">
          <motion.div
            className="prog-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="prog-cyber-label">
              <span className="prog-cyber-label__dot"></span>
              {heroBadge}
            </div>

            <h1 className="prog-hero-title">
              <span>{heroLines[0]}</span>
              <span>{heroLines[1]}</span>
              <span>{heroLines[2]}</span>
            </h1>

            <p className="prog-hero-subtitle">{heroSubtitle}</p>

            <div className="prog-hero-actions">
              <a href={ctaPrimaryUrl} className="prog-btn-glow">{ctaPrimary}</a>
              <Link to={ctaSecondaryUrl} className="prog-btn-outline">{ctaSecondary}</Link>
            </div>

            <div className="prog-hero-stats">
              <div className="prog-hero-stat">
                <strong>{programs.length}+</strong>
                <span>Live Programs</span>
              </div>
              <div className="prog-hero-stat">
                <strong>All</strong>
                <span>Skill Levels</span>
              </div>
              <div className="prog-hero-stat">
                <strong>Live</strong>
                <span>& Recorded</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="program-list" className="programs-filter section-padding">
        <div className="container">
          <div className="programs-toolbar">
            <div className="filter-bar" aria-label="Filter programs by dance style">
              {danceStyles.map((style) => (
                <button
                  key={style}
                  className={`filter-btn ${activeStyle === style ? 'active' : ''}`}
                  onClick={() => setActiveStyle(style)}
                  type="button"
                >
                  {style}
                </button>
              ))}
            </div>
            <label className="program-search">
              <span>Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Bollywood, kids, salsa..."
              />
            </label>
          </div>

          {loading && <div className="programs-status">Loading live programs...</div>}

          <div className="programs-grid">
            {filteredPrograms.map((program, index) => {
              const title = getText(program.name);
              const description = getText(program.description);
              const style = program.danceStyle || program.DanceStyle || program.category || 'General';
              const href = `/contact?source=program&program=${encodeURIComponent(title)}`;

              return (
                <motion.article
                  key={program._id || title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.18) }}
                  className="program-card"
                >
                  <div className="program-image">
                    <img
                      src={program.thumbnail || program.image || imageFallback}
                      alt={title}
                      onError={(event) => {
                        event.currentTarget.src = imageFallback;
                      }}
                    />
                    <div className="price-tag">{formatPrice(program)}</div>
                  </div>
                  <div className="program-info">
                    <div className="program-meta">
                      <span className="level-badge">{formatLevel(program.level)}</span>
                      <span>{style}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{description || 'Structured dance training with GDP Studio coaches.'}</p>
                    <div className="program-details">
                      <span>{program.duration || 8} {program.durationUnit || 'weeks'}</span>
                      <span>{program.recordedClasses?.length || 6}+ sessions</span>
                    </div>
                    <div className="program-footer">
                      <Link to={href} className="primary-btn">Enquire Now</Link>
                      <ShareActions
                        title={title}
                        text={`I want to join ${title} at GDP Studio`}
                        path="/programs"
                        compact
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {!loading && filteredPrograms.length === 0 && (
            <div className="programs-empty">
              <h3>No matching programs found</h3>
              <p>Try another dance style or send us a custom choreography request.</p>
              <Link to="/contact" className="primary-btn">Contact GDP Studio</Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;

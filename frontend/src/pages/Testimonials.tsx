import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import testimonial_data from '../data/home-data/TestimonialData';
import { getTestimonials, type Testimonial } from '../services/testimonialService';
import { getLocalizedValue } from '../utils/contentHelper';
import { usePageContent, renderSplitHeroTitle } from '../hooks/usePageContent';

type TestimonialCard = {
  title: string;
  designation: string;
  desc: string;
  avatar?: string;
};

const mapApiToCard = (t: Testimonial): TestimonialCard => ({
  title: t.name,
  designation: t.position || 'Member',
  desc: getLocalizedValue(t.message, ''),
  avatar: t.image,
});

const mapFallbackToCard = (t: (typeof testimonial_data)[number]): TestimonialCard => ({
  title: t.title,
  designation: t.designation,
  desc: t.desc,
  avatar: t.avatar,
});

const Testimonials: React.FC = () => {
  const { content } = usePageContent('testimonials');
  const hero = renderSplitHeroTitle(content, { before: 'ARTISTIC ', highlight: 'VOICES' });
  const heroSubtitle =
    (content.heroSubtitle as string) ||
    'Real stories of transformation and excellence from the GDP Studio community.';
  const [cards, setCards] = useState<TestimonialCard[]>(
    testimonial_data.map(mapFallbackToCard),
  );

  useEffect(() => {
    getTestimonials({ isActive: true, limit: 50 })
      .then((data) => {
        if (data.testimonials && data.testimonials.length > 0) {
          setCards(data.testimonials.map(mapApiToCard));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <section className="testimonials-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            {hero.before}<span className="gradient-text">{hero.highlight}</span>
          </motion.h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      <section className="testimonials-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            {cards.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="testimonial-card glass-card"
                style={{ padding: '60px', position: 'relative' }}
              >
                <div style={{ position: 'absolute', top: '40px', left: '40px', fontSize: '60px', opacity: 0.1, color: 'var(--accent-color)' }}>"</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: '18px', color: 'var(--text-white)', marginBottom: '30px', lineHeight: '1.8', fontStyle: 'italic' }}>
                    {t.desc}
                  </p>
                  <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.title}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>
                        {t.title.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{t.title}</h4>
                      <span style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: '600' }}>{t.designation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Optional Video Testimonials Section placeholder */}
          <div className="video-testimonials section-padding" style={{ marginTop: '80px', textAlign: 'center' }}>
            <h2 className="section-title" style={{ fontSize: '32px' }}>VIDEO <span className="gradient-text">EXPERIENCES</span></h2>
            <div className="gallery-grid" style={{ marginTop: '40px' }}>
               {[1, 2].map(idx => (
                 <div key={idx} className="glass-card" style={{ height: '350px', position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
                    <img src={`https://images.unsplash.com/photo-${idx === 1 ? '1547153760-18fc86324498' : '1508700115892-45ecd05ae2ad'}?auto=format&fit=crop&q=80`} alt="Video Testimonial" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="play-btn-pulse" style={{ background: 'var(--primary-color)' }}>▶</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;

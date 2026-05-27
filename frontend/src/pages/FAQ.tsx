import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { getFAQs } from '../services/cmsService';
import { usePageContent, renderSplitHeroTitle } from '../hooks/usePageContent';

const DEFAULT_FAQS = [
  {
    question: "What dance styles do you teach at Garima Dance Production?",
    answer: "We specialize in a rich variety of Indian classical and modern styles including Kathak, Bharatnatyam, Bollywood, Contemporary, and traditional Folk dances. Our classes are designed for all levels of experience."
  },
  {
    question: "Do you offer online live Zoom classes?",
    answer: "Yes, absolutely! We offer high-quality live interactive classes via Zoom. In addition, students have 24/7 access to our extensive video library containing pre-recorded choreography and tutorial sessions."
  },
  {
    question: "Can absolute beginners join the programs?",
    answer: "Yes, we welcome dancers of all levels. We have foundation programs tailored specifically for beginners to help build rhythm, grace, posture, and core dance techniques from the ground up."
  },
  {
    question: "How do the membership plans work?",
    answer: "We offer flexible monthly and annual plans. Each plan grants access to specific live sessions, complete video library access, workshop discounts, and one-on-one virtual choreography assessments based on your selected tier."
  }
];

const FAQ: React.FC = () => {
  const { content } = usePageContent('faq');
  const hero = renderSplitHeroTitle(content, { before: 'COMMON ', highlight: 'QUESTIONS' });
  const heroSubtitle =
    (content.heroSubtitle as string) || 'Everything you need to know about joining GDP Studio.';
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    getFAQs()
      .then((data) => {
        if (data && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      })
      .catch(() => setFaqs(DEFAULT_FAQS));
  }, []);

  return (
    <Layout>
      <section className="faq-hero section-padding">
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

      <section className="faq-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="faq-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="faq-item glass-card"
                style={{ marginBottom: '20px', padding: '30px' }}
              >
                <h3 style={{ fontSize: '18px', color: 'var(--accent-color)', marginBottom: '15px', letterSpacing: '1px' }}>{faq.question}</h3>
                <p style={{ color: 'var(--text-gray)', lineHeight: '1.6', fontSize: '15px' }}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;

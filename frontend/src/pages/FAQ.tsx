import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "WHAT IS THE REGISTRATION PROCESS?",
      answer: "You can register online through our Membership page. Choose a plan that suits your goals, complete the payment, and you'll get immediate access to our member portal."
    },
    {
      question: "DO YOU OFFER PROGRAMS FOR BEGINNERS?",
      answer: "Yes, we have specialized programs for all levels, from 'Intro to Rhythm' for absolute beginners to 'Mastery' levels for professional dancers."
    },
    {
      question: "CAN I CANCEL MY MEMBERSHIP AT ANY TIME?",
      answer: "Monthly memberships can be cancelled at any time through your dashboard settings. Annual plans have a commitment period but offer significant savings."
    },
    {
      question: "HOW DO I ACCESS LIVE ZOOM SESSIONS?",
      answer: "Once registered, all live session links are available in your Member Dashboard under the 'Session Schedule' tab."
    },
    {
      question: "WHO ARE THE DANCE COACHES?",
      answer: "Our coaches are world-class performers and choreographers with years of experience in their respective styles. You can view their profiles on the 'Dance Coaches' page."
    }
  ];

  return (
    <Layout>
      <section className="faq-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            COMMON <span className="gradient-text">QUESTIONS</span>
          </motion.h1>
          <p className="hero-subtitle">Everything you need to know about joining GDP Academy.</p>
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

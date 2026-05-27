import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import event_data from '../data/home-data/EventData';
import { getPageContentBySlug } from '../services/cmsService';
import '../styles/live-zoom.css';

type LiveSession = {
  id: number | string;
  title: string;
  date: string;
  location: string;
  time?: string;
  desc?: string;
};

type JoinStep = {
  step: string;
  title: string;
  desc: string;
};

const DEFAULT_SESSIONS: LiveSession[] = event_data.map((s) => ({
  id: s.id,
  title: s.title,
  date: s.date,
  location: s.location,
  time: s.time,
  desc: s.desc,
}));

const DEFAULT_JOIN_STEPS: JoinStep[] = [
  { step: '01', title: 'REGISTER', desc: 'Sign up for the session through your student dashboard or the links above.' },
  { step: '02', title: 'PREPARE', desc: 'Ensure you have a stable internet connection and enough space to move freely.' },
  { step: '03', title: 'DANCE', desc: 'Click the join button 5 minutes before the session starts to enter the Zoom lobby.' },
];

const DEFAULT_HERO_TITLE = 'LIVE ZOOM SESSIONS';
const DEFAULT_HERO_SUBTITLE =
  'Interactive real-time dance training with our world-class masters from the comfort of your home.';

const LiveZoomSessions: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>(DEFAULT_SESSIONS);
  const [joinSteps, setJoinSteps] = useState<JoinStep[]>(DEFAULT_JOIN_STEPS);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_HERO_TITLE);
  const [heroSubtitle, setHeroSubtitle] = useState(DEFAULT_HERO_SUBTITLE);

  useEffect(() => {
    getPageContentBySlug('live-zoom')
      .then((page) => {
        const c = page?.content;
        if (!c) return;
        if (c.sessions?.length > 0) {
          setSessions(
            c.sessions.map((s: LiveSession, index: number) => ({
              id: s.id ?? index + 1,
              title: s.title,
              date: s.date,
              location: s.location,
              time: s.time,
              desc: s.desc,
            })),
          );
        }
        if (c.joinSteps?.length > 0) {
          setJoinSteps(c.joinSteps);
        }
        if (c.heroTitle) setHeroTitle(c.heroTitle);
        if (c.heroSubtitle) setHeroSubtitle(c.heroSubtitle);
      })
      .catch(() => {});
  }, []);

  const titleParts = heroTitle.split(' ');
  const titleLead = titleParts.length > 1 ? titleParts.slice(0, -1).join(' ') : heroTitle;
  const titleAccent = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';

  return (
    <Layout>
      <section className="live-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            {titleAccent ? (
              <>
                {titleLead} <span className="gradient-text">{titleAccent}</span>
              </>
            ) : (
              titleLead
            )}
          </motion.h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      <section className="live-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="workshops-list" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {sessions.map((session, i) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="workshop-row"
              >
                <div className="session-info-wrapper">
                  <div className="session-date-box">
                    <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--font-title)' }}>{session.date.split(' ')[0]}</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '2px' }}>{session.date.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', justifyContent: 'inherit' }}>
                       <span style={{ background: 'rgba(30, 255, 228, 0.1)', color: 'var(--accent-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>LIVE NOW</span>
                       <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Zoom Cloud Meetings</span>
                    </div>
                    <h3 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '700' }}>{session.title}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '16px' }}>Master Coach: {session.location} | Duration: 90 Mins</p>
                  </div>
                </div>
                <div className="session-actions" style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', marginBottom: '15px', fontWeight: '600' }}>Starting in 15:00</p>
                  <button className="primary-btn join-btn" style={{ background: 'var(--primary-color)' }}>JOIN SESSION</button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="live-guidelines section-padding" style={{ marginTop: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
            <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '30px' }}>HOW TO <span className="gradient-text">JOIN</span></h2>
            <div className="steps-grid">
               {joinSteps.map((s) => (
                 <div key={s.step}>
                    <span style={{ fontSize: '40px', fontWeight: '800', color: 'rgba(255,255,255,0.1)', display: 'block', marginBottom: '10px' }}>{s.step}</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{s.title}</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', lineHeight: '1.6' }}>{s.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LiveZoomSessions;

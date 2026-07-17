import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { getPageContentBySlug } from '../services/cmsService';
import '../styles/theme.css';

type ScheduleRow = {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
};

const DEFAULT_SCHEDULE: ScheduleRow[] = [
  { time: '08:00 AM', monday: 'Ballet I', tuesday: 'Yoga for Dancers', wednesday: 'Ballet I', thursday: 'Stretch & Flex', friday: 'Ballet II' },
  { time: '10:00 AM', monday: 'Contemporary', tuesday: 'Jazz Fusion', wednesday: 'Contemporary', thursday: 'Urban Hip-Hop', friday: 'Jazz Fusion' },
  { time: '02:00 PM', monday: 'Urban Hip-Hop', tuesday: 'Latin Ballroom', wednesday: 'Urban Hip-Hop', thursday: 'Contemporary', friday: 'Latin Ballroom' },
  { time: '05:00 PM', monday: 'Breakdance', tuesday: 'Ballet III', wednesday: 'Breakdance', thursday: 'Advanced Jazz', friday: 'Showcase Prep' },
  { time: '07:00 PM', monday: 'Live Workshop', tuesday: 'Coach Q&A', wednesday: 'Live Workshop', thursday: 'Member Social', friday: 'Live Workshop' },
];

const DEFAULT_HERO_TITLE = 'SESSION SCHEDULE';
const DEFAULT_HERO_SUBTITLE =
  'Plan your practice with our weekly schedule of live and in-studio sessions.';

const Schedule: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleRow[]>(DEFAULT_SCHEDULE);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_HERO_TITLE);
  const [heroSubtitle, setHeroSubtitle] = useState(DEFAULT_HERO_SUBTITLE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getPageContentBySlug('schedule')
      .then((page) => {
        const c = page?.content;
        if (!c) return;
        if (c.scheduleRows?.length > 0) {
          setScheduleData(c.scheduleRows);
        }
        if (c.heroTitle) {
          setHeroTitle(c.heroTitle);
        }
        if (c.heroSubtitle) {
          setHeroSubtitle(c.heroSubtitle);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  return (
    <Layout>
      <section className="schedule-hero section-padding" style={{ paddingBottom: '40px' }}>
        <div className="container">
          {!ready ? (
            <>
              <div className="home-skel" style={{ height: 40, width: 280, margin: '0 auto 16px' }} />
              <div className="home-skel" style={{ height: 16, width: '60%', maxWidth: 480, margin: '0 auto' }} />
            </>
          ) : (
            <>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-title"
              >
                {heroTitle.includes(' ') ? (
                  <>
                    {heroTitle.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="gradient-text">{heroTitle.split(' ').slice(-1)[0]}</span>
                  </>
                ) : (
                  <>
                    SESSION <span className="gradient-text">{heroTitle}</span>
                  </>
                )}
              </motion.h1>
              <p className="hero-subtitle">{heroSubtitle}</p>
            </>
          )}
        </div>
      </section>

      <section className="schedule-table-section section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="glass-card schedule-container" style={{ overflowX: 'auto', padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px', color: 'var(--accent-color)' }}>TIME</th>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px' }}>MONDAY</th>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px' }}>TUESDAY</th>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px' }}>WEDNESDAY</th>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px' }}>THURSDAY</th>
                  <th style={{ padding: '24px', fontSize: '12px', letterSpacing: '2px' }}>FRIDAY</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '24px', fontWeight: '700', fontSize: '14px', color: 'var(--text-gray)' }}>{row.time}</td>
                    <td style={{ padding: '24px' }}>
                      <div className="session-slot">
                        <span className="session-name">{row.monday}</span>
                        <span className="session-type">Studio</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div className="session-slot">
                        <span className="session-name">{row.tuesday}</span>
                        <span className="session-type">{row.tuesday.includes('Q&A') ? 'Live' : 'Studio'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div className="session-slot">
                        <span className="session-name">{row.wednesday}</span>
                        <span className="session-type">Studio</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div className="session-slot">
                        <span className="session-name">{row.thursday}</span>
                        <span className="session-type">Live</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div className="session-slot">
                        <span className="session-name">{row.friday}</span>
                        <span className="session-type">Studio</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="schedule-footer" style={{ marginTop: '40px', textAlign: 'center' }}>
             <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '24px' }}>
               All times are shown in your local timezone. Live Zoom Workshops require registration.
             </p>
             <button className="primary-btn join-btn">BOOK A SESSION</button>
          </div>
        </div>
      </section>

      <style>{`
        .session-slot {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .session-name {
          font-weight: 600;
          font-size: 14px;
          color: #fff;
        }
        .session-type {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-color);
          opacity: 0.8;
        }
        tr:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </Layout>
  );
};

export default Schedule;

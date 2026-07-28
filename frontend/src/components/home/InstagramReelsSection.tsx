import React from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import InstaReelCard from './InstaReelCard';

export type InstagramReelItem = {
  vid: string;
  reelId?: string;
  url?: string;
  delay: number;
  offset: string;
  likes: string;
  comments: string;
};

type Props = {
  reels: InstagramReelItem[];
  handle: string;
};

const InstagramReelsSection: React.FC<Props> = ({ reels, handle }) => {
  return (
    <section className="youtube-shorts-section section-padding">
      <div className="container">
        <div className="youtube-shorts-content">
          <div className="youtube-shorts-header">
            <motion.h2
              className="insta-title"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Join us <br /> <span className="gradient-text">on Instagram</span>
            </motion.h2>

            <div className="youtube-header-actions">
              <motion.div
                className="youtube-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="yt-header-meta" style={{ padding: '4px 8px' }}>
                  <span className="youtube-handle">{handle}</span>
                </div>
              </motion.div>
            </div>
          </div>

          <HomeMediaMarquee
            items={reels}
            ariaLabel="Instagram reels"
            renderItem={(item) => {
              const r = item as InstagramReelItem;
              return r.reelId ? (
                <InstaReelCard reelId={r.reelId} url={r.url || ''} />
              ) : null;
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default InstagramReelsSection;

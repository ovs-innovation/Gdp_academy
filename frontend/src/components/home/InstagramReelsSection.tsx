import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';

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

const MuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>
);

const UnmuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const InstagramReelsSection: React.FC<Props> = ({ reels, handle }) => {
  // Instagram embed does not natively support mute param,
  // but we track state so toggling reloads the iframe (which starts muted by default in embed)
  const [muted, setMuted] = useState(true);

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

              {/* Mute/Unmute toggle */}
              <motion.button
                className="media-mute-btn"
                onClick={() => setMuted((m) => !m)}
                title={muted ? 'Unmute reels' : 'Mute reels'}
                aria-label={muted ? 'Unmute' : 'Mute'}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                {muted ? <MuteIcon /> : <UnmuteIcon />}
                <span>{muted ? 'Unmute' : 'Mute'}</span>
              </motion.button>
            </div>
          </div>

          <HomeMediaMarquee
            items={reels}
            ariaLabel="Instagram reels"
            renderItem={(item) => {
              const reel = item as InstagramReelItem;
              const reelUrl = reel.url || `https://www.instagram.com/reel/${reel.reelId}/`;
              // Instagram embed URL — `muted` state used as key to force iframe reload on toggle
              const embedSrc = `https://www.instagram.com/p/${reel.reelId}/embed/`;

              return (
                <div className="yt-short-card">
                  <a
                    href={reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="yt-short-iframe-link"
                    aria-label="Watch Instagram reel"
                  >
                    <iframe
                      key={`${reel.reelId}-${muted}`}
                      src={embedSrc}
                      className="yt-short-iframe"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media; autoplay"
                      title={`Instagram reel ${reel.reelId}`}
                    />
                    <div className="yt-short-overlay" />
                  </a>

                  {/* Instagram badge */}
                  <div className="yt-shorts-ui">
                    <div className="yt-shorts-top-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      <span>Reels</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default InstagramReelsSection;

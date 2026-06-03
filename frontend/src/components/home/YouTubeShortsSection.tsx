import React from 'react';
import { motion } from 'framer-motion';
import LazyVideo from '../common/LazyVideo';
import HomeMediaMarquee from './HomeMediaMarquee';
import MediaProfileAvatar from './MediaProfileAvatar';
import YouTubeSubscribeButton from './YouTubeSubscribeButton';

export type YouTubeShortItem = {
  vid: string;
  title: string;
  views: string;
  likes: string;
  delay: number;
};

type Props = {
  shorts: YouTubeShortItem[];
  channel: string;
  channelUrl: string;
  channelId?: string | null;
  logoUrl?: string | null;
};

const YouTubeShortsSection: React.FC<Props> = ({ shorts, channel, channelUrl, channelId, logoUrl }) => {
  const openChannel = () => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
  <section className="youtube-shorts-section section-padding">
    <div className="container">
      <motion.div className="youtube-shorts-content">
        <div className="youtube-shorts-header">
          <motion.h2
            className="insta-title"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Join us <br /> <span className="gradient-text youtube-gradient">on YouTube</span>
          </motion.h2>
          <div className="youtube-header-actions">
            <motion.a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="youtube-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <span className="youtube-handle">{channel}</span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <YouTubeSubscribeButton
                channelUrl={channelUrl}
                channelId={channelId}
                className="yt-subscribe-btn--header"
              />
            </motion.div>
          </div>
        </div>

        <HomeMediaMarquee
          items={shorts}
          renderItem={(item) => (
            <div
              role="link"
              tabIndex={0}
              className="yt-short-card"
              aria-label={`Open ${channel} on YouTube`}
              onClick={openChannel}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openChannel();
                }
              }}
            >
              <LazyVideo src={item.vid} scale={1.1} />

              <div className="yt-shorts-ui">
                <div className="yt-shorts-top-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>Shorts</span>
                </div>

                <div className="yt-shorts-side-actions">
                  <div className="yt-short-action">
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                    <span>{item.likes}</span>
                  </div>
                  <div className="yt-short-action">
                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24" style={{ transform: 'rotate(180deg)' }}>
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                  </div>
                  <div className="yt-short-action">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>24</span>
                  </div>
                  <div className="yt-short-action">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>Share</span>
                  </div>
                </div>

                <div className="yt-shorts-bottom-info">
                  <div className="yt-short-channel">
                    <MediaProfileAvatar logoUrl={logoUrl} className="yt-short-avatar" />
                    <span className="yt-short-channel-name" title={channel}>
                      {channel}
                    </span>
                    <YouTubeSubscribeButton channelUrl={channelUrl} channelId={channelId} />
                  </div>
                  <p className="yt-short-title">{item.title}</p>
                  <span className="yt-short-views">{item.views} views</span>
                </div>
              </div>

              <div className="yt-short-overlay" />
            </div>
          )}
        />
      </motion.div>
    </div>
  </section>
  );
};

export default YouTubeShortsSection;

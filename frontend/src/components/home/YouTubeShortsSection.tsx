import React from 'react';
import { motion } from 'framer-motion';
import LazyVideo from '../common/LazyVideo';
import HomeMediaMarquee from './HomeMediaMarquee';
import { HomeMediaSkeleton } from './HomeSkeletons';

export type YouTubeShortItem = {
  vid: string;
  title: string;
  views: string;
  likes: string;
  delay: number;
  shortUrl?: string; // Optional direct link to the YouTube Short
};

type Props = {
  shorts: YouTubeShortItem[];
  channel: string;
  channelUrl: string;
  channelId?: string | null;
  logoUrl?: string | null;
  loading?: boolean;
};

/** Strip leading @ from a channel handle for display */
const cleanChannelName = (channel: string): string =>
  channel.startsWith('@') ? channel.slice(1) : channel;

const YouTubeShortsSection: React.FC<Props> = ({
  shorts,
  channel,
  loading = false,
}) => {
  const displayName = cleanChannelName(channel);

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
            {!loading && (
              <div className="youtube-header-actions">
                {/* Channel badge — display name only, NO icon/avatar */}
                <motion.div
                  className="youtube-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="yt-header-meta" style={{ padding: '4px 8px' }}>
                    <span className="youtube-handle">{displayName}</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {loading ? (
            <HomeMediaSkeleton count={4} ariaLabel="Loading YouTube shorts" />
          ) : (
            <HomeMediaMarquee
              items={shorts}
              ariaLabel="YouTube shorts"
              renderItem={(item) => (
                <div className="yt-short-card">
                  <LazyVideo src={item.vid} scale={1.1} />

                  <div className="yt-shorts-ui">
                    {/* Shorts badge top-left */}
                    <div className="yt-shorts-top-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>Shorts</span>
                    </div>

                    {/* Bottom info — Like/comment/share and channel info REMOVED */}
                    <div className="yt-shorts-bottom-info">
                      <p className="yt-short-title">{item.title}</p>
                      <span className="yt-short-views">{item.views} views</span>
                    </div>
                  </div>

                  <div className="yt-short-overlay" />
                </div>
              )}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeShortsSection;

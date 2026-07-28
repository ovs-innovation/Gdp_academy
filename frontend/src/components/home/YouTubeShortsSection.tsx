import React from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import { HomeMediaSkeleton } from './HomeSkeletons';
import YTShortCard from './YTShortCard';

export type YouTubeShortItem = {
  vid: string;
  title: string;
  views: string;
  likes: string;
  delay: number;
  ytId?: string; // Real YouTube Short ID
  shortUrl?: string;
};

type Props = {
  shorts: YouTubeShortItem[];
  channel: string;
  channelUrl: string;
  channelId?: string | null;
  logoUrl?: string | null;
  loading?: boolean;
};

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
              renderItem={(item) => {
                const s = item as YouTubeShortItem;
                return s.ytId ? (
                  <YTShortCard ytId={s.ytId} title={s.title} views={s.views} />
                ) : null;
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeShortsSection;

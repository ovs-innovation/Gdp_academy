import React from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import { HomeMediaSkeleton } from './HomeSkeletons';
import YTShortCard from './YTShortCard';
import DirectVideoCard from './DirectVideoCard';
import { isDirectVideoUrl, resolvePublicMediaUrl } from '../../utils/mediaUrl';
import type { YouTubeShortItem } from '../../lib/homeCms';

type Props = {
  shorts: YouTubeShortItem[];
  channel: string;
  channelUrl: string;
  channelId?: string | null;
  logoUrl?: string | null;
  loading?: boolean;
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
};

const cleanChannelName = (channel: string): string =>
  channel.startsWith('@') ? channel.slice(1) : channel;

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const YouTubeShortsSection: React.FC<Props> = ({
  shorts,
  channel,
  loading = false,
  activeVideoId,
  setActiveVideoId,
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
                  <div className="yt-header-meta">
                    <span className="youtube-icon-wrapper" aria-hidden>
                      <YouTubeIcon />
                    </span>
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
              renderItem={(item, index) => {
                const s = item as YouTubeShortItem;
                const videoSrc =
                  s.vid && isDirectVideoUrl(s.vid) ? resolvePublicMediaUrl(s.vid) : '';
                const ytId = s.ytId;
                const itemId = videoSrc || ytId || `yt-${index}`;

                if (videoSrc) {
                  return (
                    <DirectVideoCard
                      src={videoSrc}
                      isPlaying={activeVideoId === itemId}
                      onPlay={() => setActiveVideoId(itemId)}
                      title={s.title}
                      views={s.views}
                      likes={s.likes}
                    />
                  );
                }

                if (ytId) {
                  const isPlaying = activeVideoId === ytId;
                  return (
                    <YTShortCard
                      ytId={ytId}
                      title={s.title}
                      views={s.views}
                      isPlaying={isPlaying}
                      onPlay={() => setActiveVideoId(ytId)}
                    />
                  );
                }

                return null;
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeShortsSection;

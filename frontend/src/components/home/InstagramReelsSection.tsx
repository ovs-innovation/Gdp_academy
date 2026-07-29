import React from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import InstaReelCard from './InstaReelCard';
import DirectVideoCard from './DirectVideoCard';
import { isDirectVideoUrl, resolvePublicMediaUrl } from '../../utils/mediaUrl';
import type { InstagramReelItem } from '../../lib/homeCms';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden>
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M17.5 6.51L17.51 6.49889"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Props = {
  reels: InstagramReelItem[];
  handle: string;
  sectionTitle?: string;
  sectionHighlight?: string;
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
};

const InstagramReelsSection: React.FC<Props> = ({
  reels,
  handle,
  sectionTitle = 'Join us',
  sectionHighlight = 'on Instagram',
  activeVideoId,
  setActiveVideoId,
}) => {
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
              {sectionTitle} <br /> <span className="gradient-text">{sectionHighlight}</span>
            </motion.h2>

            <div className="youtube-header-actions">
              <motion.div
                className="youtube-badge"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="yt-header-meta">
                  <span className="insta-icon-wrapper" aria-hidden>
                    <InstagramIcon />
                  </span>
                  <span className="youtube-handle">{handle}</span>
                </div>
              </motion.div>
            </div>
          </div>

          <HomeMediaMarquee
            items={reels}
            ariaLabel="Instagram reels"
            renderItem={(item, index) => {
              const r = item as InstagramReelItem;
              const videoSrc =
                r.vid && isDirectVideoUrl(r.vid) ? resolvePublicMediaUrl(r.vid) : '';
              const reelId = r.reelId;
              const itemId = videoSrc || reelId || `insta-${index}`;

              if (videoSrc) {
                return (
                  <DirectVideoCard
                    src={videoSrc}
                    isPlaying={activeVideoId === itemId}
                    onPlay={() => setActiveVideoId(itemId)}
                    likes={r.likes}
                    comments={r.comments}
                  />
                );
              }

              if (reelId) {
                const isPlaying = activeVideoId === reelId;
                return (
                  <InstaReelCard
                    reelId={reelId}
                    isPlaying={isPlaying}
                    onPlay={() => setActiveVideoId(reelId)}
                  />
                );
              }

              return null;
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default InstagramReelsSection;

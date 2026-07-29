import React from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import InstaReelCard from './InstaReelCard';
import DirectVideoCard from './DirectVideoCard';
import { isDirectVideoUrl, resolvePublicMediaUrl } from '../../utils/mediaUrl';
import type { InstagramReelItem } from '../../lib/homeCms';

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
                <div className="yt-header-meta" style={{ padding: '4px 8px' }}>
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

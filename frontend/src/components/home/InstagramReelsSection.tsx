import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import HomeMediaMarquee from './HomeMediaMarquee';
import InstaReelCard from './InstaReelCard';
import MediaPlayButton from './MediaPlayButton';
import { isDirectVideoUrl, resolvePublicMediaUrl } from '../../utils/mediaUrl';
import type { InstagramReelItem } from '../../lib/homeCms';

const mediaFillStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

/** First-frame poster. Image request only — never the MP4. */
function cloudinaryVideoPoster(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('res.cloudinary.com')) return null;
    const marker = '/video/upload/';
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;
    const rest = parsed.pathname.slice(idx + marker.length).replace(/\.(mp4|webm|mov|m4v)$/i, '');
    parsed.pathname = `${parsed.pathname.slice(0, idx)}${marker}so_0,f_auto,q_auto,w_600/${rest}.jpg`;
    parsed.search = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

type DirectReelProps = {
  id: string;
  src: string;
  isPlaying: boolean;
  onActivate: (id: string) => void;
  likes?: string;
  comments?: string;
};

const InstagramDirectReelCard = React.memo(function InstagramDirectReelCard({
  id,
  src,
  isPlaying,
  onActivate,
  likes,
  comments,
}: DirectReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const poster = useMemo(() => cloudinaryVideoPoster(src), [src]);

  useEffect(() => {
    if (!isPlaying) {
      setReady(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [isPlaying, src]);

  const play = () => onActivate(id);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    play();
  };

  return (
    <div
      className="yt-short-card"
      role="button"
      tabIndex={0}
      aria-label="Play reel"
      onClick={play}
      onKeyDown={onKeyDown}
    >
      <div
        className="yt-short-iframe-wrapper"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            className="yt-short-iframe"
            decoding="async"
            draggable={false}
            style={{
              ...mediaFillStyle,
              opacity: isPlaying && ready ? 0 : 1,
              transition: 'opacity 0.35s ease',
            }}
          />
        )}
        {isPlaying && (
          <video
            ref={videoRef}
            src={src}
            className="yt-short-iframe"
            muted
            loop
            playsInline
            autoPlay
            controls
            preload="auto"
            onPlaying={() => setReady(true)}
            style={{
              ...mediaFillStyle,
              opacity: ready ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
        )}
        {!isPlaying && (
          <>
            <div className="yt-short-overlay gdp-video-card-overlay" aria-hidden="true" />
            <MediaPlayButton size="md" />
          </>
        )}
      </div>

      {(likes || comments) && (
        <div className="yt-shorts-ui">
          <div className="yt-shorts-bottom-info">
            <span className="yt-short-views">
              {[likes && `${likes} likes`, comments && `${comments} comments`]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

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
                  <InstagramDirectReelCard
                    id={itemId}
                    src={videoSrc}
                    isPlaying={activeVideoId === itemId}
                    onActivate={setActiveVideoId}
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

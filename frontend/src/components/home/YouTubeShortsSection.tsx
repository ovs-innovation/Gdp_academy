import React, { useState } from 'react';
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

function buildYtShortsEmbedUrl(ytId: string, muted: boolean): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: muted ? '1' : '0',
    loop: '1',
    playlist: ytId,
    controls: '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`;
}

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

const YouTubeShortsSection: React.FC<Props> = ({
  shorts,
  channel,
  loading = false,
}) => {
  const [muted, setMuted] = useState(true);
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

                {/* Mute/Unmute toggle */}
                <motion.button
                  className="media-mute-btn"
                  onClick={() => setMuted((m) => !m)}
                  title={muted ? 'Unmute videos' : 'Mute videos'}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {muted ? <MuteIcon /> : <UnmuteIcon />}
                  <span>{muted ? 'Unmute' : 'Mute'}</span>
                </motion.button>
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
                const ytId = (item as YouTubeShortItem).ytId;
                return (
                  <div className="yt-short-card">
                    {ytId ? (
                      <a
                        href={`https://youtube.com/shorts/${ytId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="yt-short-iframe-link"
                        aria-label={`Watch: ${item.title}`}
                      >
                        <iframe
                          key={`${ytId}-${muted}`}
                          src={buildYtShortsEmbedUrl(ytId, muted)}
                          className="yt-short-iframe"
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          title={item.title}
                        />
                        <div className="yt-short-overlay" />
                      </a>
                    ) : (
                      <LazyVideo src={item.vid} scale={1.1} />
                    )}

                    <div className="yt-shorts-ui">
                      <div className="yt-shorts-top-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>Shorts</span>
                      </div>
                      <div className="yt-shorts-bottom-info">
                        <p className="yt-short-title">{item.title}</p>
                        {item.views && <span className="yt-short-views">{item.views} views</span>}
                      </div>
                    </div>

                    {!ytId && <div className="yt-short-overlay" />}
                  </div>
                );
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeShortsSection;

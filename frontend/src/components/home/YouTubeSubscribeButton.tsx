import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gdp_yt_subscribed';

type Props = {
  channelUrl?: string;
  channelId?: string | null;
  className?: string;
};

const YouTubeSubscribeButton: React.FC<Props> = ({ className = '' }) => {
  // Persist subscribed state across cards and page reloads
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const handleSubscribe = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isSubscribed;
    setIsSubscribed(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch {}
  }, [isSubscribed]);

  // Sync across multiple instances on same page
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) {
        setIsSubscribed(ev.newValue === '1');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <button
      type="button"
      className={`yt-subscribe-btn ${isSubscribed ? 'yt-subscribed' : ''} ${className}`.trim()}
      onClick={handleSubscribe}
      aria-label={isSubscribed ? 'Subscribed to YouTube channel' : 'Subscribe on YouTube'}
    >
      {isSubscribed ? (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Subscribed
        </>
      ) : (
        'Subscribe'
      )}
    </button>
  );
};

export default YouTubeSubscribeButton;

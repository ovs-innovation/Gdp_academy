import React from 'react';
import { resolveYoutubeChannelId } from '../../utils/socialLinks';

type Props = {
  channelUrl: string;
  channelId?: string | null;
  className?: string;
};

const POPUP_FEATURES = 'noopener,noreferrer,width=520,height=720,scrollbars=yes,resizable=yes';

const YouTubeSubscribeButton: React.FC<Props> = ({ channelUrl, channelId, className = '' }) => {
  const youtubeChannelId = resolveYoutubeChannelId(channelUrl, channelId ?? undefined);
  const subscribeUrl = `https://www.youtube.com/channel/${youtubeChannelId}?sub_confirmation=1`;

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(subscribeUrl, 'gdpYoutubeSubscribe', POPUP_FEATURES);
  };

  return (
    <button
      type="button"
      className={`yt-subscribe-btn ${className}`.trim()}
      onClick={handleSubscribe}
      aria-label="Subscribe on YouTube"
    >
      Subscribe
    </button>
  );
};

export default YouTubeSubscribeButton;

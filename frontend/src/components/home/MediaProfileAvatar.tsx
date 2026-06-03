import React from 'react';
import SiteLogo from '../common/SiteLogo';

type Props = {
  logoUrl?: string | null;
  className?: string;
};

/** 32×32 circular channel avatar for YouTube Shorts / Instagram reels UI */
const MediaProfileAvatar: React.FC<Props> = ({ logoUrl, className = '' }) => (
  <div className={`media-profile-avatar ${className}`.trim()} aria-hidden>
    <SiteLogo logoUrl={logoUrl} className="media-profile-avatar__img" alt="" />
  </div>
);

export default MediaProfileAvatar;

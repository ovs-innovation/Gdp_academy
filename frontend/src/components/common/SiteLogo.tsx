import React, { useEffect, useState } from 'react';
import { DEFAULT_SITE_LOGO, resolveSiteLogoUrl } from '../../utils/siteLogo';

type SiteLogoProps = {
  logoUrl?: string | null;
  className?: string;
  alt?: string;
};

const SiteLogo: React.FC<SiteLogoProps> = ({
  logoUrl,
  className,
  alt = 'Garima Dance Productions',
}) => {
  const preferred = resolveSiteLogoUrl(logoUrl);
  const [src, setSrc] = useState(preferred);

  useEffect(() => {
    setSrc(resolveSiteLogoUrl(logoUrl));
  }, [logoUrl]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== DEFAULT_SITE_LOGO) {
          setSrc(DEFAULT_SITE_LOGO);
        }
      }}
    />
  );
};

export default SiteLogo;

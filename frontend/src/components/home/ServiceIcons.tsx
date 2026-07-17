import type { ImgHTMLAttributes, ReactNode } from 'react';

export const SERVICE_ICON_IMAGES = {
  onlineDance: '/onlineclass.png',
  wedding: '/dance.png',
  comboFitness: '/combo.png',
} as const;

type ServiceIconImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
};

const ServiceIconImg: React.FC<ServiceIconImgProps> = ({ src, alt = '', className, ...rest }) => (
  <img
    src={src}
    alt={alt}
    className={className ? `service-icon-img ${className}` : 'service-icon-img'}
    loading="lazy"
    decoding="async"
    draggable={false}
    {...rest}
  />
);

export const OnlineDanceClassesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ServiceIconImg src={SERVICE_ICON_IMAGES.onlineDance} alt="" className={className} />
);

export const WeddingChoreographyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ServiceIconImg src={SERVICE_ICON_IMAGES.wedding} alt="" className={className} />
);

export const OnlineComboFitnessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ServiceIconImg src={SERVICE_ICON_IMAGES.comboFitness} alt="" className={className} />
);

const SERVICE_ICON_BY_KEY: Record<string, ReactNode> = {
  'wedding-choreography': <WeddingChoreographyIcon />,
  'wedding-private-coaching': <WeddingChoreographyIcon />,
  'online-dance-classes': <OnlineDanceClassesIcon />,
  'hiphop-street-foundations': <OnlineDanceClassesIcon />,
  'pre-recorded-courses': <OnlineComboFitnessIcon />,
  'online-combo-fitness': <OnlineComboFitnessIcon />,
  'fitness-classes': <OnlineComboFitnessIcon />,
  'stage-performance-choreography': <OnlineComboFitnessIcon />,
};

export const getServiceIcon = (opts: { key?: string; title?: string }): ReactNode => {
  const key = (opts.key || '').toLowerCase();
  if (key && SERVICE_ICON_BY_KEY[key]) {
    return SERVICE_ICON_BY_KEY[key];
  }

  const title = (opts.title || '').toLowerCase();
  if (title.includes('wedding') || title.includes('sangeet')) return <WeddingChoreographyIcon />;
  if (title.includes('online') && title.includes('dance')) return <OnlineDanceClassesIcon />;
  if (
    title.includes('combo') ||
    title.includes('fitness') ||
    title.includes('recorded') ||
    title.includes('pre-recorded')
  ) {
    return <OnlineComboFitnessIcon />;
  }

  return <OnlineDanceClassesIcon />;
};

export default getServiceIcon;

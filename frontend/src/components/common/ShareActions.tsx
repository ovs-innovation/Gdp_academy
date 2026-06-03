import React from 'react';
import { buildShareUrl, shareToInstagram, shareToWhatsApp } from '../../utils/share';

interface ShareActionsProps {
  title: string;
  text?: string;
  path?: string;
  className?: string;
  compact?: boolean;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.488" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="2" />
    <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareActions: React.FC<ShareActionsProps> = ({
  title,
  text,
  path = '',
  className = '',
  compact = false,
}) => {
  const shareText = text || title;
  const url = buildShareUrl(path);

  return (
    <div className={`share-actions ${compact ? 'share-actions--compact' : ''} ${className}`.trim()}>
      {!compact && <span className="share-actions__label">Share</span>}
      <button
        type="button"
        className="share-actions__btn share-actions__btn--whatsapp"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
        onClick={() => shareToWhatsApp(shareText, url)}
      >
        <WhatsAppIcon />
        {!compact && <span>WhatsApp</span>}
      </button>
      <button
        type="button"
        className="share-actions__btn share-actions__btn--instagram"
        title="Share on Instagram"
        aria-label="Share on Instagram"
        onClick={() => shareToInstagram(shareText, url)}
      >
        <InstagramIcon />
        {!compact && <span>Instagram</span>}
      </button>
    </div>
  );
};

export default ShareActions;

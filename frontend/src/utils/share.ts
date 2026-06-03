const SITE_NAME = 'GDP — Garima Dance Productions';

export function buildShareUrl(path = ''): string {
  if (typeof window === 'undefined') return `https://garimadanceproductions.com${path}`;
  const base = window.location.origin;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function shareToWhatsApp(text: string, url?: string): void {
  const message = url ? `${text}\n${url}` : text;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

/**
 * Instagram has no public web share intent, so we copy the caption + link to the
 * clipboard and open Instagram in a new tab so the user can paste it into a
 * post / story / DM.
 */
export async function shareToInstagram(text: string, url?: string): Promise<void> {
  const message = url ? `${text}\n${url}` : text;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    }
  } catch {
    /* clipboard may be unavailable — still open Instagram */
  }
  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
}

export function shareToFacebook(url: string): void {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
}

export function shareToTwitter(text: string, url: string): void {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer',
  );
}

export function shareToLinkedIn(url: string): void {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
}

export function shareNative(title: string, text: string, url: string): void {
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({ title, text, url }).catch(() => {
      shareToWhatsApp(`${text} — ${SITE_NAME}`, url);
    });
    return;
  }
  shareToWhatsApp(`${text} — ${SITE_NAME}`, url);
}

export function copyShareLink(url: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(url);
  }
  return Promise.reject(new Error('Clipboard unavailable'));
}

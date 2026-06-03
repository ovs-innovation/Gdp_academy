import { resolvePublicMediaUrl } from './mediaUrl';

/** Bundled GDP logo — always available in frontend/public */
export const DEFAULT_SITE_LOGO = '/logo.png';

function isLocalDevHost(hostname: string): boolean {
  return /^(localhost|127\.0\.0\.1)$/i.test(hostname);
}

/**
 * Resolve header/footer logo: default GDP logo unless admin set a valid custom URL.
 */
export function resolveSiteLogoUrl(logoUrl?: string | null): string {
  const trimmed = logoUrl?.trim() || '';
  if (!trimmed) return DEFAULT_SITE_LOGO;

  if (trimmed === DEFAULT_SITE_LOGO || /\/logo\.png$/i.test(trimmed)) {
    return DEFAULT_SITE_LOGO;
  }

  if (/GDP_logo\.png/i.test(trimmed)) {
    return DEFAULT_SITE_LOGO;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith('/uploads/')) {
        return `${parsed.pathname}${parsed.search}`;
      }
      if (!isLocalDevHost(parsed.hostname)) {
        return trimmed;
      }
      return DEFAULT_SITE_LOGO;
    } catch {
      return DEFAULT_SITE_LOGO;
    }
  }

  const resolved = resolvePublicMediaUrl(trimmed);
  return resolved || DEFAULT_SITE_LOGO;
}

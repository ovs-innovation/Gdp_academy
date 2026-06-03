export const DEFAULT_INSTAGRAM_PROFILE_URL =
  'https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==';

export const DEFAULT_YOUTUBE_CHANNEL_URL =
  'https://www.youtube.com/@garimadanceproductions1146';

/** Required for YouTube’s in-page subscribe button (handles @ URLs are not supported). */
export const DEFAULT_YOUTUBE_CHANNEL_ID = 'UCdSmMd0SD9w4SPHfNf1-CAA';

/** CMS may store a full URL or only @handle — always return a profile link. */
export function resolveInstagramProfileUrl(
  channelUrl?: string,
  handle?: string,
  fallback = DEFAULT_INSTAGRAM_PROFILE_URL,
): string {
  const url = (channelUrl || '').trim();
  if (url && /^https?:\/\//i.test(url)) return url;

  const slug = (handle || '').trim().replace(/^@/, '');
  if (slug) return `https://www.instagram.com/${slug}/`;

  return fallback;
}

export function resolveYoutubeChannelUrl(
  channelUrl?: string,
  fallback = DEFAULT_YOUTUBE_CHANNEL_URL,
): string {
  const url = (channelUrl || '').trim();
  if (url && /^https?:\/\//i.test(url)) return url;
  return fallback;
}

/** Opens the channel page with YouTube’s subscribe confirmation prompt. */
export function resolveYoutubeSubscribeUrl(channelUrl: string): string {
  try {
    const url = new URL(channelUrl);
    url.searchParams.set('sub_confirmation', '1');
    return url.toString();
  } catch {
    const sep = channelUrl.includes('?') ? '&' : '?';
    return `${channelUrl}${sep}sub_confirmation=1`;
  }
}

/** Handle (`@name`) or legacy path slug from a channel URL (not the UC id). */
export function extractYoutubeChannelHandle(channelUrl: string, fallbackHandle?: string): string {
  const fallback = (fallbackHandle || '').trim().replace(/^@/, '');

  try {
    const url = new URL(channelUrl);
    const atHandle = url.pathname.match(/\/@([^/?#]+)/);
    if (atHandle?.[1]) return atHandle[1];

    const customPath = url.pathname.match(/\/c\/([^/?#]+)/);
    if (customPath?.[1]) return customPath[1];

    const userPath = url.pathname.match(/\/user\/([^/?#]+)/);
    if (userPath?.[1]) return userPath[1];
  } catch {
    /* use fallback */
  }

  return fallback || 'garimadanceproductions1146';
}

/** UC channel id for g-ytsubscribe — only works with `data-channelid`, not @handles. */
export function resolveYoutubeChannelId(
  channelUrl?: string,
  explicitChannelId?: string,
): string {
  const fromCms = (explicitChannelId || '').trim();
  if (/^UC[\w-]{22}$/i.test(fromCms)) return fromCms;

  const url = (channelUrl || '').trim();
  if (url) {
    try {
      const parsed = new URL(url);
      const channelId = parsed.pathname.match(/\/channel\/(UC[\w-]{22})/i);
      if (channelId?.[1]) return channelId[1];
    } catch {
      /* fall through */
    }
  }

  return DEFAULT_YOUTUBE_CHANNEL_ID;
}

import {
  extractInstagramReelId,
  extractYoutubeVideoId,
  isDirectVideoUrl,
  isInstagramUrl,
  isYoutubeUrl,
  normalizeVideoSource,
  resolvePublicMediaUrl,
} from '../utils/mediaUrl';

export type InstagramReelItem = {
  vid: string;
  reelId?: string;
  url?: string;
  delay: number;
  offset: string;
  likes: string;
  comments: string;
};

export type YouTubeShortItem = {
  vid: string;
  title: string;
  views: string;
  likes: string;
  delay: number;
  ytId?: string;
  shortUrl?: string;
};

type RawInstagram = {
  vid?: string;
  likes?: string;
  comments?: string;
  delay?: number;
  offset?: string;
  reelId?: string;
  url?: string;
};

type RawShort = {
  vid?: string;
  title?: string;
  views?: string;
  likes?: string;
  delay?: number;
  ytId?: string;
};

function normalizeInstagramVid(vid: string): {
  vid: string;
  reelId?: string;
  url?: string;
} {
  const trimmed = (vid || '').trim();
  if (!trimmed) return { vid: '' };

  if (isDirectVideoUrl(trimmed)) {
    return { vid: resolvePublicMediaUrl(trimmed) };
  }

  const reelId = extractInstagramReelId(trimmed);
  if (reelId) {
    return {
      vid: '',
      reelId,
      url: trimmed.startsWith('http') ? trimmed : `https://www.instagram.com/reel/${reelId}/`,
    };
  }

  if (isInstagramUrl(trimmed)) {
    return { vid: trimmed };
  }

  return { vid: normalizeVideoSource(trimmed) };
}

export function normalizeInstagramPostsList(raw: unknown): InstagramReelItem[] {
  const list = Array.isArray(raw) ? raw : [];
  const offsets = ['0', '-20px', '20px', '-10px', '10px', '-30px', '30px', '-15px', '15px', '-5px'];

  return list
    .map((item: RawInstagram, index) => {
      const fromVid = normalizeInstagramVid(item?.vid || '');
      const reelId = item?.reelId || fromVid.reelId;
      const vid = fromVid.vid;

      return {
        vid,
        reelId,
        url: item?.url || fromVid.url,
        delay: typeof item?.delay === 'number' ? item.delay : index * 0.1,
        offset: item?.offset || offsets[index % offsets.length],
        likes: item?.likes || '',
        comments: item?.comments || '',
      };
    })
    .filter((item) => Boolean(item.vid) || Boolean(item.reelId));
}

export function normalizeYoutubeShortsList(raw: unknown): YouTubeShortItem[] {
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item: RawShort, index) => {
      const rawVid = (item?.vid || '').trim();
      let vid = '';
      let ytId = item?.ytId;

      if (rawVid) {
        if (isDirectVideoUrl(rawVid)) {
          vid = resolvePublicMediaUrl(rawVid);
        } else if (isYoutubeUrl(rawVid)) {
          ytId = ytId || extractYoutubeVideoId(rawVid) || undefined;
        } else {
          vid = normalizeVideoSource(rawVid);
        }
      }

      return {
        vid,
        ytId,
        title: item?.title || '',
        views: item?.views || '',
        likes: item?.likes || '',
        delay: typeof item?.delay === 'number' ? item.delay : index * 0.1,
      };
    })
    .filter((item) => Boolean(item.vid) || Boolean(item.ytId));
}

/** CMS items first; empty slots filled from defaults (up to maxItems). */
export function mergeMediaList<T extends Record<string, unknown>>(
  cmsItems: T[],
  defaults: T[],
  hasContent: (item: T | undefined) => boolean,
  maxItems = 10,
): T[] {
  const result: T[] = [];
  for (let i = 0; i < maxItems; i++) {
    const cms = cmsItems[i];
    const fallback = defaults[i] ?? defaults[i % defaults.length];
    result.push(hasContent(cms) ? { ...fallback, ...cms } : fallback);
  }
  return result;
}

export function normalizeHomeContent(content: Record<string, unknown> = {}) {
  const badge = String(content.heroBadgeText || content.heroBadge || "");
  const stats = String(content.statistics || content.heroStatistics || "");
  const trust = String(content.trustLogos || content.heroTrustLogos || "");
  const shortsRaw = content.youtubeShorts || content.highlightVideos || [];
  const instagramRaw = content.instagramPosts || [];
  const ctaText = String(content.ctaText || "");
  const ctaUrl = String(content.ctaUrl || "/programs");
  const workshopsTitle = String(content.workshopsTitle || content.upcomingWorkshopsTitle || "");
  const workshopsSubtitle = String(content.workshopsSubtitle || content.upcomingWorkshopsSubtitle || "");

  return {
    ...content,
    heroBadgeText: badge,
    heroBadge: badge,
    statistics: stats,
    heroStatistics: stats,
    trustLogos: trust,
    heroTrustLogos: trust,
    youtubeShorts: normalizeYoutubeShortsList(shortsRaw),
    highlightVideos: normalizeYoutubeShortsList(shortsRaw),
    instagramPosts: normalizeInstagramPostsList(instagramRaw),
    ctaText,
    ctaUrl,
    workshopsTitle,
    workshopsSubtitle,
    upcomingWorkshopsTitle: workshopsTitle,
    upcomingWorkshopsSubtitle: workshopsSubtitle,
    heroCTAButtons: [{ label: ctaText || "Explore Our Services", url: ctaUrl || "/services" }],
  };
}

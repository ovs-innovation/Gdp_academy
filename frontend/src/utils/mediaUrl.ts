/** Normalize media URLs from API/admin so they load on the public site (Vite proxy → backend). */
export function resolvePublicMediaUrl(url: string | undefined | null): string {
  if (!url?.trim()) return "";

  const trimmed = url.trim();

  // Already relative — Vite proxies /uploads to backend
  if (trimmed.startsWith("/uploads/")) return trimmed;

  // Dev: admin saved full backend URL → use path only
  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // not a full URL
  }

  return trimmed;
}

export function isDirectVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    /\.(mp4|webm|mov)(\?|$)/i.test(u) ||
    u.includes("/uploads/") && /\.(mp4|webm|mov)/i.test(u)
  );
}

export function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

/** Extract YouTube video id from watch, shorts, embed, or youtu.be links */
export function extractYoutubeVideoId(url: string): string | null {
  const raw = url?.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }

    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const shorts = parsed.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (shorts) return shorts[1];

      const embed = parsed.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embed) return embed[1];
    }
  } catch {
    /* fall through to regex */
  }

  const match = raw.match(
    /(?:shorts\/|embed\/|youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] || null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/** Normalize admin/CMS video field for homepage players (MP4 path or YouTube embed). */
export function normalizeVideoSource(url: string | undefined | null): string {
  if (!url?.trim()) return "";

  const trimmed = url.trim();
  const embed = getYoutubeEmbedUrl(trimmed);
  if (embed) return embed;

  return resolvePublicMediaUrl(trimmed);
}

export type ShortLikeItem = {
  vid?: string;
  title?: string;
  views?: string;
  likes?: string;
  delay?: number;
};

export function normalizeShortsList(raw: unknown): Array<{
  vid: string;
  title: string;
  views: string;
  likes: string;
  delay: number;
}> {
  const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? [raw] : [];

  return list
    .map((item: ShortLikeItem, index) => ({
      vid: normalizeVideoSource(item?.vid || ""),
      title: item?.title || "",
      views: item?.views || "",
      likes: item?.likes || "",
      delay: typeof item?.delay === "number" ? item.delay : index * 0.1,
    }))
    .filter((item) => Boolean(item.vid));
}

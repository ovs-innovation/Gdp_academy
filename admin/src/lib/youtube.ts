/** Extract YouTube video id from watch, shorts, embed, youtu.be, or raw 11-char id. */
export function extractYoutubeVideoId(url: string): string | null {
  const raw = (url || "").trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : id || null;
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
    /* fall through */
  }

  const match = raw.match(/(?:shorts\/|embed\/|youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}

/** Show a normal watch URL in the CMS even if the DB stored a raw id / embed. */
export function toYoutubeWatchUrl(value: string): string {
  const id = extractYoutubeVideoId(value || "");
  return id ? `https://www.youtube.com/watch?v=${id}` : (value || "").trim();
}

export function youtubeThumbnailUrl(value: string): string | null {
  const id = extractYoutubeVideoId(value || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function isYoutubeValue(value: string): boolean {
  return Boolean(extractYoutubeVideoId(value || ""));
}

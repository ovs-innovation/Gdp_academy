import { extractYoutubeVideoId, toYoutubeWatchUrl } from "@/lib/youtube";

export type HeroGridItem = { type: "video" | "image"; url: string };
export type YoutubeShortItem = { vid: string; title: string; views?: string; likes?: string; delay?: number };
export type InstagramPostItem = { vid: string; likes?: string; comments?: string; delay?: number; offset?: string };
export type VideoTestimonialItem = { img: string; vid: string; id?: number };

export { extractYoutubeVideoId, toYoutubeWatchUrl } from "@/lib/youtube";

export const HERO_GRID_SLOTS = [
  "Top-left (1)",
  "Top-center (2)",
  "Top-right (3)",
  "Middle-left (4)",
  "Middle-center (5)",
  "Middle-right (6)",
  "Bottom-left (7)",
  "Bottom-center (8)",
  "Bottom-right (9)",
] as const;

export const DEFAULT_HERO_GRID: HeroGridItem[] = [
  { type: "video", url: "/hero.mp4" },
  { type: "image", url: "/svc-stage.png" },
  { type: "video", url: "/services4.mp4" },
  { type: "image", url: "/svc-wedding.jpg" },
  { type: "video", url: "/service3.mp4" },
  { type: "image", url: "/svc-hiphop.png" },
  { type: "video", url: "/services.mp4" },
  { type: "image", url: "/laptop.png" },
  { type: "video", url: "/hero.mp4" },
];

/** Turn YouTube watch/shorts links into embed URLs; keep /uploads paths as-is */
function normalizeVidForSave(vid: string): string {
  const t = (vid || "").trim();
  if (!t) return "";

  const id = extractYoutubeVideoId(t);
  if (id) return `https://www.youtube.com/embed/${id}`;

  if (t.startsWith("http://localhost:8096/uploads/")) {
    return t.replace("http://localhost:8096", "");
  }

  return t;
}

function normalizeShortsList(shorts: YoutubeShortItem[]): YoutubeShortItem[] {
  if (!Array.isArray(shorts)) return [];
  return shorts.map((item, i) => ({
    ...item,
    vid: normalizeVidForSave(item.vid || ""),
    delay: item.delay ?? i * 0.1,
  }));
}

export function normalizeHomeContentForSave(content: Record<string, unknown>) {
  const badge = (content.heroBadgeText || content.heroBadge || "") as string;
  const stats = (content.statistics || content.heroStatistics || "") as string;
  const trust = (content.trustLogos || content.heroTrustLogos || "") as string;
  const shorts = normalizeShortsList(
    (content.youtubeShorts || content.highlightVideos || []) as YoutubeShortItem[],
  );
  const instagramPosts = Array.isArray(content.instagramPosts)
    ? (content.instagramPosts as InstagramPostItem[]).map((item, i) => ({
        ...item,
        vid: normalizeVidForSave(item.vid || ""),
        delay: item.delay ?? i * 0.1,
      }))
    : [];
  const videoTestimonials = Array.isArray(content.videoTestimonials)
    ? (content.videoTestimonials as VideoTestimonialItem[]).map((item) => ({
        ...item,
        vid: normalizeVidForSave(item.vid || ""),
      }))
    : [];
  const ctaText = (content.ctaText || "") as string;
  const ctaUrl = (content.ctaUrl || "/programs") as string;
  const grid =
    Array.isArray(content.heroGridItems) && content.heroGridItems.length > 0
      ? content.heroGridItems
      : DEFAULT_HERO_GRID;

  const aboutYoutubeId =
    extractYoutubeVideoId(String(content.aboutYoutubeId || "")) ||
    String(content.aboutYoutubeId || "").trim();
  const heroYoutubeId =
    extractYoutubeVideoId(String(content.heroYoutubeId || "")) ||
    String(content.heroYoutubeId || "").trim();

  return {
    ...content,
    heroBadgeText: badge,
    heroBadge: badge,
    statistics: stats,
    heroStatistics: stats,
    trustLogos: trust,
    heroTrustLogos: trust,
    youtubeShorts: shorts,
    highlightVideos: shorts,
    instagramPosts,
    videoTestimonials,
    aboutYoutubeId,
    heroYoutubeId,
    ctaText,
    ctaUrl,
    heroGridItems: grid,
    heroCTAButtons: [{ label: ctaText || "GET STARTED", url: ctaUrl }],
    workshopsTitle: (content.workshopsTitle || content.upcomingWorkshopsTitle || "") as string,
    workshopsSubtitle: (content.workshopsSubtitle || content.upcomingWorkshopsSubtitle || "") as string,
    upcomingWorkshopsTitle: (content.workshopsTitle || content.upcomingWorkshopsTitle || "") as string,
    upcomingWorkshopsSubtitle: (content.workshopsSubtitle || content.upcomingWorkshopsSubtitle || "") as string,
  };
}

function displayYoutubeOrFile(vid: string): string {
  return extractYoutubeVideoId(vid) ? toYoutubeWatchUrl(vid) : vid;
}

/** Load into the editor as pasteable YouTube links (not raw IDs). */
export function normalizeHomeContentFromApi(content: Record<string, unknown>) {
  const saved = normalizeHomeContentForSave(content);
  const shorts = (saved.youtubeShorts as YoutubeShortItem[]).map((item) => ({
    ...item,
    vid: displayYoutubeOrFile(item.vid || ""),
  }));
  const videoTestimonials = (saved.videoTestimonials as VideoTestimonialItem[]).map((item) => ({
    ...item,
    vid: displayYoutubeOrFile(item.vid || ""),
  }));

  return {
    ...saved,
    aboutYoutubeId: toYoutubeWatchUrl(String(saved.aboutYoutubeId || "")),
    heroYoutubeId: toYoutubeWatchUrl(String(saved.heroYoutubeId || "")),
    youtubeShorts: shorts,
    highlightVideos: shorts,
    videoTestimonials,
  };
}

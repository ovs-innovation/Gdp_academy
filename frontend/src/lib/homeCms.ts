export function normalizeHomeContent(content: Record<string, unknown> = {}) {
  const badge = String(content.heroBadgeText || content.heroBadge || "");
  const stats = String(content.statistics || content.heroStatistics || "");
  const trust = String(content.trustLogos || content.heroTrustLogos || "");
  const shorts = (content.youtubeShorts || content.highlightVideos || []) as unknown[];
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
    youtubeShorts: shorts,
    highlightVideos: shorts,
    ctaText,
    ctaUrl,
    workshopsTitle,
    workshopsSubtitle,
    upcomingWorkshopsTitle: workshopsTitle,
    upcomingWorkshopsSubtitle: workshopsSubtitle,
    heroCTAButtons: [{ label: ctaText || "GET STARTED", url: ctaUrl }],
  };
}
